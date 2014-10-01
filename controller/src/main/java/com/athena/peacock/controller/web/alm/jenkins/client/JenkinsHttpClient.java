package com.athena.peacock.controller.web.alm.jenkins.client;

import static org.apache.commons.lang.StringUtils.isNotBlank;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;

import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.util.EntityUtils;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;

public class JenkinsHttpClient {

	private URI uri;
	private DefaultHttpClient client;
	private BasicHttpContext localContext;
	private HttpResponseValidator httpResponseValidator;
	private HttpResponseContent contentExtractor;

	private ObjectMapper mapper;
	private String context;

	public JenkinsHttpClient(URI uri, DefaultHttpClient defaultHttpClient) {
		this.context = uri.getPath();
		if (!context.endsWith("/")) {
			context += "/";
		}
		this.uri = uri;
		this.mapper = getDefaultMapper();
		this.client = defaultHttpClient;
		this.httpResponseValidator = new HttpResponseValidator();
		this.contentExtractor = new HttpResponseContent();
	}

	public JenkinsHttpClient(URI uri) {
		this(uri, new DefaultHttpClient());
	}

	public JenkinsHttpClient(URI uri, String username, String password) {
		this(uri);
		if (isNotBlank(username)) {
			CredentialsProvider provider = client.getCredentialsProvider();
			AuthScope scope = new AuthScope(uri.getHost(), uri.getPort(),
					"realm");
			UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(
					username, password);
			provider.setCredentials(scope, credentials);

			localContext = new BasicHttpContext();
			localContext.setAttribute("preemptive-auth", new BasicScheme());
			client.addRequestInterceptor(new PreemptiveAuth(), 0);
		}
	}

	public <T> T get(String path, Class<T> cls) throws IOException {

		HttpGet getMethod = new HttpGet(api(path));
		HttpResponse response = client.execute(getMethod, localContext);
		try {
			httpResponseValidator.validateResponse(response);

			return objectFromResponse(cls, response);
		} finally {
			EntityUtils.consume(response.getEntity());
			releaseConnection(getMethod);
		}
	}

	public String get(String path) throws IOException {
		HttpGet getMethod = new HttpGet(api(path));
		HttpResponse response = client.execute(getMethod, localContext);
		try {
			httpResponseValidator.validateResponse(response);
			return contentExtractor.contentAsString(response);
		} finally {
			releaseConnection(getMethod);
		}
	}

	private String urlJoin(String path1, String path2) {
		if (!path1.endsWith("/")) {
			path1 += "/";
		}
		if (path2.startsWith("/")) {
			path2 = path2.substring(1);
		}
		return path1 + path2;
	}

	private URI api(String path) {
		if (!path.toLowerCase().matches("https?://.*")) {
			path = urlJoin(this.context, path);
		}
		if (!path.contains("?")) {
			path = urlJoin(path, "api/json");
		} else {
			String[] components = path.split("\\?", 2);
			path = urlJoin(components[0], "api/json") + "?" + components[1];
		}
		return uri.resolve("/").resolve(path);
	}

	private <T> T objectFromResponse(Class<T> cls, HttpResponse response)
			throws IOException {

		InputStream content = contentExtractor.contentAsInputStream(response);
		T result = mapper.readValue(content, cls);
		return result;
	}

	private ObjectMapper getDefaultMapper() {
		ObjectMapper mapper = new ObjectMapper();
		DeserializationConfig deserializationConfig = mapper
				.getDeserializationConfig();
		mapper.setDeserializationConfig(deserializationConfig
				.without(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES));
		return mapper;
	}

	private void releaseConnection(HttpRequestBase httpRequestBase) {
		httpRequestBase.releaseConnection();
	}

}
