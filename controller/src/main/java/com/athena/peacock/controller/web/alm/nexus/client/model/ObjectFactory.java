//
// �� ������ JAXB(JavaTM Architecture for XML Binding) ���� ���� 2.2.7 ������ ���� �����Ǿ����ϴ�. 
// <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a>�� �����Ͻʽÿ�. 
// �� ������ �����ϸ� �ҽ� ��Ű���� ���������� �� ���� ������ �սǵ˴ϴ�. 
// ���� ��¥: 2014.09.29 �ð� 10:31:00 AM KST 
//


package com.athena.peacock.controller.web.alm.nexus.client.model;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.athena.peacock.controller.web.alm.nexus.client.model package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _ArchetypeCatalog_QNAME = new QName("http://maven.apache.org/plugins/maven-archetype-plugin/archetype-catalog/1.0.0", "archetype-catalog");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.athena.peacock.controller.web.alm.nexus.client.model
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link ArchetypeCatalog }
     * 
     */
    public ArchetypeCatalog createArchetypeCatalog() {
        return new ArchetypeCatalog();
    }

    /**
     * Create an instance of {@link Archetype }
     * 
     */
    public Archetype createArchetype() {
        return new Archetype();
    }

    /**
     * Create an instance of {@link ArchetypeCatalog.Archetypes }
     * 
     */
    public ArchetypeCatalog.Archetypes createArchetypeCatalogArchetypes() {
        return new ArchetypeCatalog.Archetypes();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ArchetypeCatalog }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://maven.apache.org/plugins/maven-archetype-plugin/archetype-catalog/1.0.0", name = "archetype-catalog")
    public JAXBElement<ArchetypeCatalog> createArchetypeCatalog(ArchetypeCatalog value) {
        return new JAXBElement<ArchetypeCatalog>(_ArchetypeCatalog_QNAME, ArchetypeCatalog.class, null, value);
    }

}
