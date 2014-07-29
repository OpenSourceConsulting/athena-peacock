/* 
 * Athena Peacock Project - Server Provisioning Engine for IDC or Cloud
 * 
 * Copyright (C) 2013 Open Source Consulting, Inc. All rights reserved by Open Source Consulting, Inc.
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
 * Ji-Woong Choi	2013. 10. 23.		First Draft.
 */
package com.athena.peacock.controller.web.rhevm;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import com.athena.peacock.controller.common.component.RHEVMRestTemplate;
import com.athena.peacock.controller.web.rhevm.dto.NetworkDto;
import com.athena.peacock.controller.web.rhevm.dto.TemplateDto;
import com.athena.peacock.controller.web.rhevm.dto.VMDto;
import com.redhat.rhevm.api.model.Action;
import com.redhat.rhevm.api.model.Boot;
import com.redhat.rhevm.api.model.Cluster;
import com.redhat.rhevm.api.model.DataCenter;
import com.redhat.rhevm.api.model.Host;
import com.redhat.rhevm.api.model.IP;
import com.redhat.rhevm.api.model.NIC;
import com.redhat.rhevm.api.model.Nics;
import com.redhat.rhevm.api.model.OperatingSystem;
import com.redhat.rhevm.api.model.Template;
import com.redhat.rhevm.api.model.Templates;
import com.redhat.rhevm.api.model.VM;
import com.redhat.rhevm.api.model.VMs;

/**
 * <pre>
 * RHEV-M Service Class
 * </pre>
 * @author Ji-Woong Choi
 * @version 1.0
 */
@Service("rhevmService")
public class RHEVMService {
	
	protected final Logger logger = LoggerFactory.getLogger(RHEVMService.class);

	@Inject
	@Named("restTemplate")
	private RHEVMRestTemplate rhevTemplate;

	/**
	 * RHEV에 생성되어 있는 가상머신의 목록을 조회한다.
	 * @return 가상 머신 목록
	 * @throws RestClientException
	 * @throws Exception
	 */
	public List<VMDto> getVirtualList() throws RestClientException, Exception {
		
		List<VMDto> vmDtoList = new ArrayList<VMDto>();
		
		VMs vms = rhevTemplate.submit(RHEVApi.VMS, HttpMethod.GET, VMs.class);
		List<VM> vmList = vms.getVMs();
		
		for( VM vm : vmList) {
			vmDtoList.add(makeDto(vm));
		}
		return vmDtoList;
	}
	
	/**
	 * RHEV에 생성된 가상 머신 템플릿 목록을 조회한다.
	 * @return
	 * @throws RestClientException
	 * @throws Exception
	 */
	public List<TemplateDto> getTemplateList()  throws RestClientException, Exception {
		List<TemplateDto> templateDtoList = new ArrayList<TemplateDto>();
		
		Templates templates = rhevTemplate.submit(RHEVApi.TEMPLATES, HttpMethod.GET, Templates.class);
		List<Template> templateList = templates.getTemplates();
		
		for( Template template : templateList) {
			templateDtoList.add(makeDto(template));
		}
		return templateDtoList;
	}
	
	/**
	 * RHEV에 생성된 가상 머신 템플릿을 조회한다.
	 * @return
	 * @throws RestClientException
	 * @throws Exception
	 */
	public TemplateDto getTemplate(String templateId)  throws RestClientException, Exception {
		String templateUrl =  RHEVApi.TEMPLATES + "/" + templateId;
		Template template = rhevTemplate.submit(templateUrl, HttpMethod.GET, Template.class);
		
		return makeDto(template);
	}
	
	/**
	 * 템플릿과 가상 머신 이름을 사용하여 새로운 가상 머신을 생성한다.
	 * @param vmName
	 * @param templateId
	 * @return
	 * @throws RestClientException
	 * @throws Exception
	 */
	public VM createVirtualMachine(String vmName, String templateId) throws RestClientException, Exception {
		
		logger.debug("vmName : {}, templateId : {}", vmName, templateId);
		
		Template template = new Template();
		template.setId(templateId);

		VM vm = new VM();
		vm.setName(vmName);
		vm.setTemplate(template);
		
		return createVirtualMachine(vm);
	}
	
	/**
	 * VM 정보를 활용하여 새로운 가상 머신을 생성한다.
	 * @param vm
	 * @return
	 * @throws RestClientException
	 * @throws Exception
	 */
	public VM createVirtualMachine(VM vm) throws RestClientException, Exception {
		
		// Retrieve origin objects
		String templateUrl =  RHEVApi.TEMPLATES + "/" + vm.getTemplate().getId();
		Template template = rhevTemplate.submit(templateUrl, HttpMethod.GET, Template.class);
		
		String clusterUrl = template.getCluster().getHref();
		Cluster cluster = rhevTemplate.submit(clusterUrl,  HttpMethod.GET, Cluster.class);
		
		// Make request paramater
		Cluster requestCluster = new Cluster();
		requestCluster.setName(cluster.getName());
		
		Template requestTemplate  = new Template();
		requestTemplate.setName(template.getName());
		
		OperatingSystem os = new OperatingSystem();
		Boot boot = new Boot();
		boot.setDev(template.getOs().getBoot().get(0).getDev());
		os.getBoot().add(boot);
		
		vm.setCluster(requestCluster);
		vm.setTemplate(requestTemplate);
		vm.setOs(os);
		vm.setMemory(template.getMemory());
	
		return rhevTemplate.submit(RHEVApi.VMS, HttpMethod.POST, vm, "vm",VM.class);
	}
	
	/**
	 * RHEV에 생성되어 있는 가상머신의 목록을 조회한다.
	 * @return 가상 머신 목록
	 * @throws RestClientException
	 * @throws Exception
	 */
	public List<NetworkDto> getNicList(String vmId) throws RestClientException, Exception {
		
		List<NetworkDto> networkDtoList = new ArrayList<NetworkDto>();
		String callUrl = RHEVApi.VMS + "/" + vmId + "/nics";
		Nics nics = rhevTemplate.submit(callUrl, HttpMethod.GET, Nics.class);

		List<NIC> nicList = nics.getNics();
		
		for( NIC nic : nicList) {
			networkDtoList.add(makeDto(nic));
		}
		return networkDtoList;
	}
		
	

	/**
	 * 특정 가상 머신을 조회한다.
	 * @param vmId
	 * @return
	 * @throws Exception
	 */
	public VMDto getVirtualMachine(String vmId) throws Exception {
		String callUrl = RHEVApi.VMS + "/" + vmId;
		VM vm = rhevTemplate.submit(callUrl,  HttpMethod.GET, VM.class);
		return makeDto(vm);
	}

	/**
	 * 특정 가상 머신을 시작시킨다.
	 * @param vmId
	 * @return
	 * @throws Exception
	 */
	public Action startVirtualMachine(String vmId) throws Exception {
		String callUrl = RHEVApi.VMS + "/" + vmId + "/start";
		Action action = new Action();
		action = rhevTemplate.submit(callUrl,  HttpMethod.POST, action, "action", Action.class);
		return action;
	}
	
	/**
	 * 특정 가상 머신을 중지시킨다.
	 * @param vmId
	 * @return
	 * @throws Exception
	 */
	public Action stopVirtualMachine(String vmId) throws Exception {
		String callUrl = RHEVApi.VMS + "/" + vmId + "/stop";
		Action action = new Action();
		action = rhevTemplate.submit(callUrl,  HttpMethod.POST, action, "action", Action.class);
		return action;
	}
	
	/**
	 * 특정 가산 머신을 셧다운 시킨다.
	 * @param vmId
	 * @return
	 * @throws Exception
	 */
	public Action powerOffVirtualMachine(String vmId) throws Exception {
		String callUrl = RHEVApi.VMS + "/" + vmId + "/shutdown";
		Action action = new Action();
		action = rhevTemplate.submit(callUrl,  HttpMethod.POST, action, "action", Action.class);
		return action;
	}
	
	/**
	 * 특정 가상 머신을 강제로 제거한다.
	 * @param vmId
	 * @return
	 * @throws Exception
	 */
	public Action removeVirtualMachine(String vmId) throws Exception {
		String callUrl = RHEVApi.VMS + "/" + vmId;
		Action action = new Action();
		action.setForce(true);
		action = rhevTemplate.submit(callUrl,  HttpMethod.DELETE, action, "action", Action.class);
		return action;
	}
	
	/**
	 * RHEV Template 데이터를 추출하여 DTO로 저장한다.
	 * @param template
	 * @return
	 */
	private TemplateDto makeDto(Template template) {
		TemplateDto dto = new TemplateDto();
		
		dto.setTemplateId(template.getId());
		dto.setName(template.getName());
		dto.setDescription(template.getDescription());
		dto.setStatus(template.getStatus().getState());
		dto.setType(template.getType());
		
		dto.setDisplay(template.getDisplay().getType());
		dto.setCreationTime(template.getCreationTime().toString());
		
		dto.setMemory((template.getMemory()/1024/1024) + "MB");
		dto.setSockets(template.getCpu().getTopology().getSockets());
		dto.setCores(template.getCpu().getTopology().getCores());
		
		// Optional information
		
		try {
			String clusterUrl = template.getCluster().getHref();
			Cluster cluster = rhevTemplate.submit(clusterUrl,  HttpMethod.GET, Cluster.class);
			if(cluster != null) dto.setCluster(cluster.getName());
			
			String dcUrl = cluster.getDataCenter().getHref();
			DataCenter dc = rhevTemplate.submit(dcUrl,  HttpMethod.GET, DataCenter.class);
			if( dc != null) dto.setDataCenter(dc.getName());
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dto;
	}
	
	/**
	 * NIC으로부터 값을 추출하여 NetworkDto로 맵핑시킨다.
	 * 
	 * @param nic
	 * @return
	 */
	private NetworkDto makeDto(NIC nic) {
		NetworkDto dto = new NetworkDto();
		dto.setName(nic.getName());
		dto.setMacAddress(nic.getMac().getAddress());
		dto.setType(nic.getInterface());
		return dto;
	}


	/**
	 * Internal하게 VM으로부터 필요한 데이터를 추출하도록 한다. 
	 * @param vm
	 * @return
	 */
	private VMDto makeDto(VM vm) {
		VMDto dto = new VMDto();
		dto.setVmId(vm.getId());
		dto.setName(vm.getName());
		dto.setDescription(vm.getDescription());
		dto.setType(vm.getType());

		dto.setOs(vm.getOs().getType());
		dto.setMemory((vm.getMemory()/1024/1024) + "MB");
		dto.setSocket(vm.getCpu().getTopology().getSockets());
		dto.setCores(vm.getCpu().getTopology().getCores());
		dto.setOrigin(vm.getOrigin());
		dto.setPriority(vm.getHighAvailability().getPriority().toString());
		dto.setDisplay(vm.getDisplay().getType());
		dto.setStatus(vm.getStatus().getState());
		dto.setCreationTime(vm.getCreationTime().toString());
		
		if(vm.getStartTime() != null) dto.setStartTime(vm.getStartTime().toString());
		
		// Optional information
		
		try {
			// Getting IP Address
			if( vm.getGuestInfo() != null ) {
				IP ip = vm.getGuestInfo().getIps().getIPs().get(0);
				if( ip != null) dto.setIpAddr(ip.getAddress());
			}
			
			String clusterUrl = vm.getCluster().getHref();
			Cluster cluster = rhevTemplate.submit(clusterUrl, HttpMethod.GET, Cluster.class);
			if(cluster != null) dto.setCluster(cluster.getName());
			
			String dcUrl = cluster.getDataCenter().getHref();
			DataCenter dc = rhevTemplate.submit(dcUrl, HttpMethod.GET, DataCenter.class);
			if( dc != null) dto.setDataCenter(dc.getName());
			
			if( vm.getHost() != null ) {
				String hostUrl = vm.getHost().getHref();
				Host host = rhevTemplate.submit(hostUrl, HttpMethod.GET, Host.class);
				if( host != null ) dto.setHost(host.getName());
			}
			
			String templateUrl = vm.getTemplate().getHref();
			Template template = rhevTemplate.submit(templateUrl, HttpMethod.GET, Template.class);
			if( template != null ) dto.setTemplate(template.getName());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return dto;
	}

}