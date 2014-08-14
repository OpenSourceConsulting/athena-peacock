/* 
 * Copyright (C) 2012-2014 Open Source Consulting, Inc. All rights reserved by Open Source Consulting, Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Revision History
 * Author			Date				Description
 * ---------------	----------------	------------
 * Sang-cheon Park	2014. 8. 12.		First Draft.
 */
package com.athena.peacock.controller.common.component;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.inject.Inject;
import javax.inject.Named;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.Marshaller;
import javax.xml.namespace.QName;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import com.athena.peacock.controller.web.hypervisor.HypervisorDto;
import com.athena.peacock.controller.web.hypervisor.HypervisorService;
import com.athena.peacock.controller.web.rhevm.RHEVApi;
import com.athena.peacock.controller.web.rhevm.domain.Nics;

/**
 * <pre>
 * Multi RHEV-M 사용을 위해 각 RHEV-M에 해당하는 RHEVRestTemplate을 관리한다.
 * </pre>
 * @author Sang-cheon Park
 * @version 1.0
 */
@Component
public class RHEVMRestTemplateManager implements InitializingBean {

	private static Map<Integer, RHEVMRestTemplate> templates = new ConcurrentHashMap<Integer, RHEVMRestTemplate>();
	
	@Inject
	@Named("hypervisorService")
	private HypervisorService hypervisorService;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		List<HypervisorDto> hypervisorList = hypervisorService.getHypervisorList();
		
		for (HypervisorDto hypervisor : hypervisorList) {
			setRHEVMRestTemplate(hypervisor);
		}
	}
	
	/**
	 * <pre>
	 * 주어진 hypervisorId에 해당하는 RHEVMRestTemplate 객체를 가져온다.
	 * </pre>
	 * @param hypervisorId
	 * @return
	 */
	public static RHEVMRestTemplate getRHEVMRestTemplate(int hypervisorId) {
		return templates.get(hypervisorId);
	}//end of getRHEVMRestTemplate()
	
	/**
	 * <pre>
	 * 주어진 정보를 이용하여 RHEVMRestTemplate 객체를 생성하고 Map에 저장한다.
	 * </pre>
	 * @param hypervisor
	 */
	public synchronized static void setRHEVMRestTemplate(HypervisorDto hypervisor) {
		RHEVMRestTemplate template = new RHEVMRestTemplate(hypervisor.getRhevmProtocol(), hypervisor.getRhevmHost(), hypervisor.getRhevmDomain(), 
				hypervisor.getRhevmPort(), hypervisor.getRhevmUsername(), hypervisor.getRhevmPassword());
		
		templates.put(hypervisor.getHypervisorId(), template);
	}//end of setRHEVMRestTemplate()
	
	/**
	 * <pre>
	 * 주어진 hypervisorId에 해당하는 RHEVMRestTemplate 객체를 제거한다.
	 * </pre>
	 * @param hypervisorId
	 */
	public synchronized static void removeRHEVMRestTemplate(int hypervisorId) {
		templates.remove(hypervisorId);
	}//end of removeRHEVMRestTemplate()
	
	/**
	 * <pre>
	 * Map에 존재하는 모든 RHEVMRestTemplate 객체를 반환한다.
	 * </pre>
	 * @return
	 */
	public static List<RHEVMRestTemplate> getAllTemplates() {
		return new ArrayList<RHEVMRestTemplate>(templates.values());
	}//end of getAllTemplates()
	
	public static void main(String[] args) throws Exception {
		RHEVMRestTemplate rhevTemplate = new RHEVMRestTemplate("HTTPS", "121.138.109.61", "internal", "8543", "admin", "redhat");

		String callUrl = RHEVApi.VMS + "/907df084-d7d6-4ecd-bf23-20531df58922/nics";
		Nics nics = rhevTemplate.submit(callUrl, HttpMethod.GET, Nics.class);
		
		JAXBContext context = JAXBContext.newInstance(Nics.class);
		Marshaller marshaller = context.createMarshaller();
		marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

		StringWriter writer = new StringWriter();
		
		QName qName = new QName("com.redhat.rhevm.api.model", "nics");
	    JAXBElement<Nics> root = new JAXBElement<Nics>(qName, Nics.class, nics);
		
	    //*
	    marshaller.marshal(root, writer);
	    /*/
		marshaller.marshal(nics, writer);
		//*/
		
		System.out.println(writer.toString());
	}
}
//end of RHEVRestTemplateManager.java