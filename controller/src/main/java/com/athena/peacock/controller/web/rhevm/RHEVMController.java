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

import java.io.File;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.athena.peacock.common.core.action.ShellAction;
import com.athena.peacock.common.core.action.support.PropertyUtil;
import com.athena.peacock.common.core.action.support.TargetHost;
import com.athena.peacock.common.core.command.Command;
import com.athena.peacock.common.core.util.SshExecUtil;
import com.athena.peacock.common.netty.PeacockDatagram;
import com.athena.peacock.common.netty.message.AbstractMessage;
import com.athena.peacock.common.netty.message.ProvisioningCommandMessage;
import com.athena.peacock.controller.netty.PeacockTransmitter;
import com.athena.peacock.controller.web.common.model.GridJsonResponse;
import com.athena.peacock.controller.web.common.model.SimpleJsonResponse;
import com.athena.peacock.controller.web.machine.MachineDto;
import com.athena.peacock.controller.web.machine.MachineService;
import com.athena.peacock.controller.web.rhevm.dto.TemplateDto;
import com.athena.peacock.controller.web.rhevm.dto.VMDto;
import com.athena.peacock.controller.web.user.UserController;
import com.athena.peacock.controller.web.user.UserDto;
import com.redhat.rhevm.api.model.VM;


/**
 * <pre>
 * This is a controller for RHEV-M API.
 * RHEV-M API�??�용???�업???�행?�는 컨트롤러
 * </pre>
 * @author Ji-Woong Choi
 * @version 1.0
 */
@Controller
@RequestMapping("/rhevm")
public class RHEVMController {

    protected final Logger LOGGER = LoggerFactory.getLogger(RHEVMController.class);
    
	@Inject
	@Named("rhevmService")
	private RHEVMService rhevmService;
	
	@Inject
	@Named("machineService")
	private MachineService machineService;

    @Inject
    @Named("peacockTransmitter")
	private PeacockTransmitter peacockTransmitter;

	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 Virtual Machine 목록??조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/list")
	public @ResponseBody GridJsonResponse getVMList(GridJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		
		if (rhevmService.getRHEVMRestTemplate(dto.getHypervisorId()) == null) {
			rhevmService.init();
		}
		
		try {
			int page = ((dto.getStart() - 1) / 100) + 1;
			
			List<VMDto> vmDtoList = rhevmService.getVirtualList(dto.getHypervisorId(), dto.getName(), page);
			jsonRes.setTotal(vmDtoList.size());
			jsonRes.setList(vmDtoList);
			jsonRes.setMsg("VM 목록???�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM 목록 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 ?�정 Virtual Machine??조회
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
		
		try {
			jsonRes.setData(rhevmService.getVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
			jsonRes.setMsg("VM ?�보�??�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM ?�보 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 ?�정 Virtual Machine???�트?�크 ?�터?�이??조회
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
		
		try {
			jsonRes.setList(rhevmService.getVMNics(dto.getHypervisorId(), dto.getVmId()));
			jsonRes.setMsg("VM???�트?�크 ?�보�??�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM???�트?�크 ?�보 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 ?�정 Virtual Machine??Disk ?�보 조회
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
		
		try {
			jsonRes.setList(rhevmService.getVMDisks(dto.getHypervisorId(), dto.getVmId()));
			jsonRes.setMsg("VM???�스???�보�??�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM???�스???�보 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 Template 목록??조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/templates")
	public @ResponseBody GridJsonResponse getTemplateList(GridJsonResponse jsonRes, TemplateDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		
		if (rhevmService.getRHEVMRestTemplate(dto.getHypervisorId()) == null) {
			rhevmService.init();
		}
		
		try {
			int page = ((dto.getStart() - 1) / 100) + 1;
			
			List<TemplateDto> templateDtoList = rhevmService.getTemplateList(dto.getHypervisorId(), dto.getName(), page);
			jsonRes.setTotal(templateDtoList.size());
			jsonRes.setList(templateDtoList);
			jsonRes.setMsg("?�플�?목록???�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("?�플�?목록 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 ?�정 Template ?�보�?조회?�다.
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
			jsonRes.setMsg("?�플�??�보�??�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("?�플�??�보 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 ?�정 Template???�트?�크 ?�터?�이??조회
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
		
		try {
			jsonRes.setList(rhevmService.getTemplateNics(dto.getHypervisorId(), dto.getTemplateId()));
			jsonRes.setMsg("?�플릿의 ?�트?�크 ?�보�??�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("?�플릿의 ?�트?�크 ?�보 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 ?�정 Template??Disk ?�보 조회
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
		
		try {
			jsonRes.setList(rhevmService.getTemplateDisks(dto.getHypervisorId(), dto.getTemplateId()));
			jsonRes.setMsg("?�플릿의 ?�스???�보�??�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("?�플릿의 ?�스???�보 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 Data Center 목록 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/datacenter")
	public @ResponseBody GridJsonResponse getDataCenter(GridJsonResponse jsonRes, Integer hypervisorId) throws Exception {
		Assert.notNull(hypervisorId, "hypervisorId must not be null.");
		
		try {
			jsonRes.setList(rhevmService.getDataCenter(hypervisorId));
			jsonRes.setMsg("Data Center 목록???�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Data Center 목록 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * �?��??RHEV-M(hypervisorId)???�당?�는 Host Cluster 목록 조회
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/hostcluster")
	public @ResponseBody GridJsonResponse getHostCluster(GridJsonResponse jsonRes, Integer hypervisorId, String dataCenterId) throws Exception {
		Assert.notNull(hypervisorId, "hypervisorId must not be null.");
		Assert.notNull(dataCenterId, "dataCenterId must not be null.");
		
		try {
			jsonRes.setList(rhevmService.getHostCluster(hypervisorId, dataCenterId));
			jsonRes.setMsg("Data Center 목록???�상?�으�?조회?�었?�니??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Data Center 목록 조회 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * RHEV-M???�플릿을 ?�용?�여 ?�규 VM???�성?�다.
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/create")
	public @ResponseBody SimpleJsonResponse createVirtualMachine(HttpServletRequest request, SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getName(), "name must not be null.");
		Assert.notNull(dto.getCluster(), "cluster must not be null.");
		Assert.notNull(dto.getTemplate(), "template must not be null.");
		Assert.isTrue(dto.getSockets() != 0, "sockets must not be 0.");
		
		try {
			// RHEV REST API�??�출?�여 VM???�성?�고 결과�?리턴받는??
			VM vm = rhevmService.createVirtualMachine(dto.getHypervisorId(), dto);
			
			// SSH Key File??존재??경우 ?�당 VM ?�성 결과??vm id�??�렉?�리�??�성?�고 ?�일????��?�다.
            if (dto.getKeyFile() != null && dto.getKeyFile().getSize() > 0 ) {
            	String defaultPath = PropertyUtil.getProperty("upload.dir") + File.separator + vm.getId() + File.separator;
            	File keyFile = new File(defaultPath + dto.getKeyFile().getOriginalFilename());
                if (!keyFile.exists()) {
                    if (!keyFile.mkdirs()) {
                        throw new Exception("Fail to create a directory for attached file [" + keyFile + "]");  
                    }
                }
                
                keyFile.deleteOnExit();
                dto.getKeyFile().transferTo(keyFile);
                dto.setSshKeyFile(keyFile.getAbsolutePath());
            }
            
            // machine_additional_info_tbl??�?? ?�보�???��?�다.
            boolean isExist = false;
            MachineDto machine = new MachineDto();

            machine.setMachineId(vm.getId());
            if (StringUtils.isNotEmpty(dto.getIpAddress())) {
                machine.setIpAddress(dto.getIpAddress());
                machine.setNetmask(dto.getNetmask());
                machine.setGateway(dto.getGateway());
                machine.setNameServer(dto.getNameServer());
            	isExist = true;
            }
            if (StringUtils.isNotEmpty(dto.getSshPort())) {
                machine.setSshPort(dto.getSshPort());
                machine.setSshUsername(dto.getSshUsername());
                machine.setSshPassword(dto.getSshPassword());
                machine.setSshKeyFile(dto.getSshKeyFile());
            	isExist = true;
            }
            if (StringUtils.isNotEmpty(dto.getHostName())) {
            	machine.setHostName(dto.getHostName());
            	isExist = true;
            }
            
            if (isExist) {
    			UserDto userDto = (UserDto)request.getSession().getAttribute(UserController.SESSION_USER_KEY);
    			if (userDto != null) {
    				machine.setRegUserId(userDto.getUserId());
    				machine.setUpdUserId(userDto.getUserId());
    			}
    			
            	machineService.insertAdditionalInfo(machine);
            }
            
			jsonRes.setMsg("VM ?�성???�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM ?�성 ?�청 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * ?�력받�? vmId�??�용?�여 RHEV-M??VM???�작?�킨?? 
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
		
		try {
			jsonRes.setData(rhevmService.startVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
			jsonRes.setMsg("VM ?�작???�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM ?�작 ?�청 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * ?�력받�? vmId�??�용?�여 RHEV-M??VM??중�??�킨?? 
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
		
		final String vmId = dto.getVmId();
		
		new Thread() {
			public void run() {
				try {
					// VM 중�? ??Agent�?중�??�킨??
					ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
					cmdMsg.setAgentId(vmId);
					cmdMsg.setBlocking(true);

					int sequence = 0;
					Command command = new Command("STOP_AGENT");
					
					ShellAction action = new ShellAction(sequence++);
					
					action.setCommand("service");
					action.addArguments("peacock-agent stop");

					command.addAction(action);
					
					cmdMsg.addCommand(command);

					PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
					peacockTransmitter.sendMessage(datagram);
				} catch (Exception e) {
					// ignore this exception
					LOGGER.error("Peacock Error", e);
					// Agent�??�치?��? ?��? VM??경우 ?�러�?발생?????�고, ?��? Agent�?종료?�어 ?�결??Channel???�을 ???�다.
				}
			};
		}.start();
		
		Thread.sleep(1000);
		
		try {
			jsonRes.setData(rhevmService.stopVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
			jsonRes.setMsg("VM 중�?�??�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM 중�? ?�청 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * ?�력받�? vmId�??�용?�여 RHEV-M??VM???�다?�시?�다. 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/shutdown")
	public @ResponseBody SimpleJsonResponse shutdownVirtualMachine(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		final String vmId = dto.getVmId();
		
		new Thread() {
			public void run() {
				try {
					// VM 중�? ??Agent�?중�??�킨??
					ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
					cmdMsg.setAgentId(vmId);
					cmdMsg.setBlocking(true);

					int sequence = 0;
					Command command = new Command("STOP_AGENT");
					
					ShellAction action = new ShellAction(sequence++);
					
					action.setCommand("service");
					action.addArguments("peacock-agent stop");

					command.addAction(action);
					
					cmdMsg.addCommand(command);

					PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
					peacockTransmitter.sendMessage(datagram);
				} catch (Exception e) {
					// ignore this exception
					LOGGER.error("Peacock Error", e);
					// Agent�??�치?��? ?��? VM??경우 ?�러�?발생?????�고, ?��? Agent�?종료?�어 ?�결??Channel???�을 ???�다.
				}
			};
		}.start();
		
		Thread.sleep(1000);
		
		try {
			jsonRes.setData(rhevmService.shutdownVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
			jsonRes.setMsg("VM 종료�??�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM 종료 ?�청 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * ?�력받�? vmId�??�용?�여 RHEV-M??VM???�거?�킨?? 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/remove")
	public @ResponseBody SimpleJsonResponse removeVirtualMachine(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		try {
			jsonRes.setData(rhevmService.removeVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
			
			// VM???�상?�으�???��??경우 DB??machine_tbl?�서???�당 VM???�거?�다.
			machineService.deleteMachine(dto.getVmId());
			
			jsonRes.setMsg("VM ??���??�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM ??�� ?�청 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * ?�력받�? vmId�??�용?�여 RHEV-M??VM??export ?�킨?? 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/export")
	public @ResponseBody SimpleJsonResponse exportVirtualMachine(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		try {
			jsonRes.setData(rhevmService.exportVirtualMachine(dto.getHypervisorId(), dto.getVmId()));
			jsonRes.setMsg("VM Export�??�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM Export ?�청 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * ?�력받�? vmId�??�용?�여 RHEV-M??VM???�플릿으�?만든?? 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/vms/makeTemplate")
	public @ResponseBody SimpleJsonResponse makeTemplate(SimpleJsonResponse jsonRes, VMDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getName(), "name must not be null.");
		Assert.notNull(dto.getVmId(), "vmId must not be null.");
		
		try {
			jsonRes.setData(rhevmService.makeTemplate(dto.getHypervisorId(), dto.getName(), dto.getVmId(), dto.getDescription()));
			jsonRes.setMsg("VM???�용???�플�??�성???�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("VM???�용???�플�??�성 ?�청 �??�러�?발생?��??�니??");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * ?�정 VM Instance�?SSH Command�??�출?�다.
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
	
	/**
	 * <pre>
	 * ?�력받�? templateId�??�용?�여 ?�플릿을 ?�거?�다. 
	 * </pre>
	 * @param jsonRes
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/templates/remove")
	public @ResponseBody SimpleJsonResponse removeTemplate(SimpleJsonResponse jsonRes, TemplateDto dto) throws Exception {
		Assert.notNull(dto.getHypervisorId(), "hypervisorId must not be null.");
		Assert.notNull(dto.getTemplateId(), "templateId must not be null.");
		
		try {
			jsonRes.setData(rhevmService.removeTemplate(dto.getHypervisorId(), dto.getTemplateId()));
			jsonRes.setMsg("?�플�???���??�상?�으�??�청?�었?�니?? ?�시�?기다?�주??��??");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("?�플�???�� ?�청 �??�러�?발생?��??�니??<br/>?�플릿을 참조?�는 VM???�는�??�인?�십?�오.");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	
}
