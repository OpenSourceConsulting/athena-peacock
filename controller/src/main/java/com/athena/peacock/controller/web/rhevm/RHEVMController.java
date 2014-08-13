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
 * Ji-Woong Choi	2013. 11. 01.		First Draft.
 */
package com.athena.peacock.controller.web.rhevm;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.athena.peacock.common.core.action.support.TargetHost;
import com.athena.peacock.common.core.util.SshExecUtil;
import com.athena.peacock.controller.web.common.model.GridJsonResponse;
import com.athena.peacock.controller.web.common.model.SimpleJsonResponse;
import com.athena.peacock.controller.web.rhevm.dto.TemplateDto;
import com.athena.peacock.controller.web.rhevm.dto.VMDto;


/**
 * <pre>
 * This is a controller for RHEV-M API.
 * RHEV-M API를 이용한 작업을 수행하는 컨트롤러
 * </pre>
 * @author Ji-Woong Choi
 * @version 1.0
 */
@Controller
@RequestMapping("/rhevm")
public class RHEVMController {

    protected final Logger logger = LoggerFactory.getLogger(RHEVMController.class);
    
	@Inject
	@Named("rhevmService")
	private RHEVMService rhevmService;

	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 Virtual Machine 목록을 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/list")
	public @ResponseBody GridJsonResponse getVMList(GridJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		
		jsonRes.setList(rhevmService.getVirtualList(dto.getHypervisorId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 특정 Virtual Machine을 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/info")
	public @ResponseBody SimpleJsonResponse getVMInfo(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		jsonRes.setData(rhevmService.getVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 특정 Virtual Machine의 네트워크 인터페이스 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/nics")
	public @ResponseBody GridJsonResponse getVMNics(GridJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		jsonRes.setList(rhevmService.getVMNics(dto.getHypervisorId(), dto.getVmId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 특정 Virtual Machine의 Disk 정보 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/disks")
	public @ResponseBody GridJsonResponse getVMDisks(GridJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		jsonRes.setList(rhevmService.getVMDisks(dto.getHypervisorId(), dto.getVmId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 Template 목록을 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/templates")
	public @ResponseBody GridJsonResponse getTemplateList(GridJsonResponse jsonRes, TemplateDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		
		try {
			jsonRes.setList(rhevmService.getTemplateList(dto.getHypervisorId()));
			
			jsonRes.setMsg("Success retriving the RHEV templates");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Error occured during RHEV template query");
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 특정 Template 정보를 조회한다.
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/templates/info")
	public @ResponseBody SimpleJsonResponse getTemplateInfo(SimpleJsonResponse jsonRes, TemplateDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getTemplateId(), "templateId must not be null.");
		
		try {
			jsonRes.setData(rhevmService.getTemplate(dto.getHypervisorId(), dto.getTemplateId()));
			
			jsonRes.setMsg("Success retrive template from RHEV");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Error occured during retrieve the template");
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 특정 Template의 네트워크 인터페이스 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/templates/nics")
	public @ResponseBody GridJsonResponse getTemplateNics(GridJsonResponse jsonRes, TemplateDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getTemplateId(), "templateId must not be null.");
		
		jsonRes.setList(rhevmService.getTemplateNics(dto.getHypervisorId(), dto.getTemplateId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 지정된 RHEV-M(hypervisorId)에 해당하는 특정 Template의 Disk 정보 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/templates/disks")
	public @ResponseBody GridJsonResponse getTemplateDisks(GridJsonResponse jsonRes, TemplateDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getTemplateId(), "templateId must not be null.");
		
		jsonRes.setList(rhevmService.getTemplateDisks(dto.getHypervisorId(), dto.getTemplateId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * RHEV-M의 템플릿을 이용하여 신규 VM을 생성한다.
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/create")
	public @ResponseBody SimpleJsonResponse createVirtualMachine(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getTemplate(), "template must not be null.");
		
		try {
			jsonRes.setData(rhevmService.createVirtualMachine(dto.getHypervisorId(), dto.getName(), dto.getTemplate()));
			
			jsonRes.setMsg("Success create a virtual machine to RHEV server");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Error occured during creating a virtual machine");
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 입력받은 vmId를 사용하여 RHEV-M의 VM을 시작시킨다. 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/start")
	public @ResponseBody SimpleJsonResponse startVirtualMachine(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		jsonRes.setData(rhevmService.startVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 입력받은 vmId를 사용하여 RHEV-M의 VM을 중지시킨다. 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/stop")
	public @ResponseBody SimpleJsonResponse stopVirtualMachine(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		jsonRes.setData(rhevmService.stopVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 입력받은 vmId를 사용하여 RHEV-M의 VM을 셧다운시킨다. 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/poweroff")
	public @ResponseBody SimpleJsonResponse powerOffVirtualMachine(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		jsonRes.setData(rhevmService.powerOffVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * 특정 VM Instance로 SSH Command를 호출한다.
	 * </pre>
	 * @param jsonRes
	 * @param targetHost
	 * @param command
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/backup")
	public @ResponseBody SimpleJsonResponse backupVirtualMachine(SimpleJsonResponse jsonRes, TargetHost targetHost, String command) throws Exception {
		Assert.isTrue(StringUtils.isNotEmpty(targetHost.getHost()), "host must not be null.");
		Assert.isTrue(targetHost.getPort() != null, "port must not be null.");
		Assert.isTrue(targetHost.getPort() != 0, "port must not be 0.");
		Assert.isTrue(StringUtils.isNotEmpty(targetHost.getUsername()), "username must not be null.");
		Assert.isTrue(StringUtils.isNotEmpty(targetHost.getPassword()), "password must not be null.");
		
		jsonRes.setData(SshExecUtil.executeCommand(targetHost, command));
		jsonRes.setMsg("VM Backup is starting. Please check your console");
		return jsonRes;
	}
	
	
}