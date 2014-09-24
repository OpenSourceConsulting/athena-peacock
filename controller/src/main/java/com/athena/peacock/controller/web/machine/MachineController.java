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
 * Sang-cheon Park	2013. 9. 9.		First Draft.
 */
package com.athena.peacock.controller.web.machine;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.athena.peacock.common.core.action.ConfigAction;
import com.athena.peacock.common.core.action.FileWriteAction;
import com.athena.peacock.common.core.action.ShellAction;
import com.athena.peacock.common.core.action.support.Property;
import com.athena.peacock.common.core.action.support.PropertyUtil;
import com.athena.peacock.common.core.command.Command;
import com.athena.peacock.common.netty.PeacockDatagram;
import com.athena.peacock.common.netty.message.AbstractMessage;
import com.athena.peacock.common.netty.message.ProvisioningCommandMessage;
import com.athena.peacock.common.netty.message.ProvisioningResponseMessage;
import com.athena.peacock.controller.netty.PeacockTransmitter;
import com.athena.peacock.controller.web.common.model.DtoJsonResponse;
import com.athena.peacock.controller.web.common.model.GridJsonResponse;
import com.athena.peacock.controller.web.rhevm.RHEVMService;
import com.athena.peacock.controller.web.rhevm.dto.VMDto;
import com.athena.peacock.controller.web.user.UserController;
import com.athena.peacock.controller.web.user.UserDto;

/**
 * <pre>
 * 
 * </pre>
 * 
 * @author Sang-cheon Park
 * @version 1.0
 */
@Controller("machineController")
@RequestMapping("/machine")
public class MachineController {

    protected final Logger logger = LoggerFactory.getLogger(MachineController.class);

	@Inject
	@Named("machineService")
	private MachineService machineService;

	@Inject
	@Named("rhevmService")
	private RHEVMService rhevmService;

    @Inject
    @Named("peacockTransmitter")
	private PeacockTransmitter peacockTransmitter;

	/**
	 * <pre>
	 * Instance 목록을 조회힌다.
	 * </pre>
	 * @param jsonRes
	 * @param machine
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/list")
	public @ResponseBody GridJsonResponse list(GridJsonResponse jsonRes, MachineDto machine) throws Exception {
		jsonRes.setTotal(machineService.getMachineListCnt(machine));
		
		List<MachineDto> machineList = machineService.getMachineList(machine);
		for (MachineDto m : machineList) {
			m.setStatus(peacockTransmitter.isActive(m.getMachineId()) == true ? "Running" : "Down");
		}
		
		jsonRes.setList(machineList);
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Instance 상세 정보를 조회한다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getMachine")
	public @ResponseBody DtoJsonResponse getMachine(DtoJsonResponse jsonRes, String machineId) throws Exception {
		MachineDto machine = machineService.getMachine(machineId);
		
		if (rhevmService.getRHEVMRestTemplate(machine.getHypervisorId()) == null) {
			rhevmService.init();
		}
		
		VMDto vm = rhevmService.getVirtualMachine(machine.getHypervisorId(), machine.getMachineId());
		machine.setDescription(vm.getDescription());
		
		jsonRes.setData(machine);
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * 고정 IP 및 SSH 설정 정보 등 Instance 부가 정보를 조회한다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getAdditionalInfo")
	public @ResponseBody DtoJsonResponse getAdditionalInfo(DtoJsonResponse jsonRes, String machineId) throws Exception {
		jsonRes.setData(machineService.getAdditionalInfo(machineId));
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Instance의 Display Name을 수정한다.
	 * </pre>
	 * @param jsonRes
	 * @param machine
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/updateMachine")
	public @ResponseBody DtoJsonResponse updateMachine(HttpServletRequest request, DtoJsonResponse jsonRes, MachineDto machine) throws Exception {
		Assert.notNull(machine.getMachineId(), "machineId can not be null.");
		Assert.notNull(machine.getDisplayName(), "displayName can not be null.");
		
		try {
            if (machine.getKeyFile() != null && machine.getKeyFile().getSize() > 0 ) {
            	String defaultPath = PropertyUtil.getProperty("upload.dir") + File.separator + machine.getMachineId() + File.separator;
            	File keyFile = new File(defaultPath + machine.getKeyFile().getOriginalFilename());
                if (!keyFile.exists()) {
                    if (!keyFile.mkdirs()) {
                        throw new Exception("Fail to create a directory for attached file [" + keyFile + "]");
                    }
                }
                
                keyFile.deleteOnExit();
                machine.getKeyFile().transferTo(keyFile);
                machine.setSshKeyFile(keyFile.getAbsolutePath());
            }

			UserDto userDto = (UserDto)request.getSession().getAttribute(UserController.SESSION_USER_KEY);
			if (userDto != null) {
				machine.setRegUserId(userDto.getUserId());
				machine.setUpdUserId(userDto.getUserId());
			}
			
			machineService.updateMachine(machine);
			
			jsonRes.setMsg("Instance 정보가 정상적으로 변경되었습니다.");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			
			if (e.getMessage().equals("VM_UP_STAT")) {
				jsonRes.setMsg("RHEV-M 패키지 버전이 3.2 미만이고 VM이 Up 상태일 경우 인스턴스 정보를 변경할 수 없습니다.");
			} else {
				jsonRes.setMsg("Instance 정보 변경 중 에러가 발생하였습니다.");
			}
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * Down 상태의 Agent를 구동시킨다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 */
	@RequestMapping("/agentStart")
	public @ResponseBody DtoJsonResponse agentStart(DtoJsonResponse jsonRes, String machineId) {
		Assert.notNull(machineId, "machineId can not be null.");
		
		try {
			machineService.agentStart(machineId);
			
			Thread.sleep(3000);
			
			jsonRes.setMsg("Agent가 정상적으로 시작하였습니다.");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Agent 시작 중 에러가 발생하였습니다.");
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
	
	/**
	 * <pre>
	 * Running 상태의 Agent를 중지시킨다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 */
	@RequestMapping("/agentStop")
	public @ResponseBody DtoJsonResponse agentStop(DtoJsonResponse jsonRes, String machineId) {
		Assert.notNull(machineId, "machineId can not be null.");
		
		try {
			machineService.agentStop(machineId);
			jsonRes.setMsg("Agent가 정상적으로 중지하였습니다.");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Agent 중지 중 에러가 발생하였습니다.");
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance에 대해 CLI 기능을 제공한다.
	 * </pre>
	 * @param jsonRes
	 * @param cli
	 * @return
	 */
	@RequestMapping("/cli")
	public @ResponseBody DtoJsonResponse cli(DtoJsonResponse jsonRes, CLIDto cli) {
		Assert.notNull(cli.getMachineId(), "machineId can not be null.");
		Assert.notNull(cli.getCommand(), "command can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(cli.getMachineId());
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("CLI");
			
			ShellAction action = new ShellAction(sequence++);
			
			if (StringUtils.isNotEmpty(cli.getWorkingDir())) {
				action.setWorkingDiretory(cli.getWorkingDir());
			}
			
			action.setCommand(cli.getCommand());

			if (StringUtils.isNotEmpty(cli.getArgs())) {
				action.addArguments(cli.getArgs());
			}
			
			command.addAction(action);
			
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("Command가 정상적으로 처리되었습니다.");
		} catch (Exception e) {
			String message = "Command 실행 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance의 그룹 목록을 조회한다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 */
	@RequestMapping("/getGroupList")
	public @ResponseBody GridJsonResponse getGroupList(GridJsonResponse jsonRes, String machineId) {
		Assert.notNull(machineId, "machineId can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(machineId);
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("GET_GROUP");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("cat");
			action.addArguments("/etc/group");

			command.addAction(action);
			
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			List<GroupDto> groupList = new ArrayList<GroupDto>();
			GroupDto group = null;
			String[] columns = null;
			
			String[] lines = response.getResults().get(0).split("\n");
			for (String line : lines) {
				if (line.startsWith("#")) {
					continue;
				}
				
				if (line.contains(":")) {
					columns = line.split(":");
					group = new GroupDto();
					group.setGroup(columns[0]);
					group.setGid(Integer.parseInt(columns[2]));
					groupList.add(group);
				}
			}
			
			jsonRes.setTotal(groupList.size());
			jsonRes.setList(groupList);
			jsonRes.setMsg("그룹 목록 수집이 정상적으로 처리되었습니다.");
		} catch (Exception e) {
			String message = "그룹 목록 수집 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance의 계정 목록을 조회한다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 */
	@RequestMapping("/getAccountList")
	public @ResponseBody GridJsonResponse getAccountList(GridJsonResponse jsonRes, String machineId) {
		Assert.notNull(machineId, "machineId can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(machineId);
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("GET_GROUP");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("cat");
			action.addArguments("/etc/group");

			command.addAction(action);
			
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			Map<String, String> groupMap = new HashMap<String, String>();
			String[] columns = null;
			
			String[] lines = response.getResults().get(0).split("\n");
			for (String line : lines) {
				if (line.startsWith("#")) {
					continue;
				}
				
				if (line.contains(":")) {
					columns = line.split(":");
					// key = gid, value = group_name
					groupMap.put(columns[2], columns[0]);
				}
			}
			
			cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(machineId);
			cmdMsg.setBlocking(true);
			
			sequence = 0;
			command = new Command("GET_ACCOUNT");
			
			action = new ShellAction(sequence++);
			
			action.setCommand("cat");
			action.addArguments("/etc/passwd");

			command.addAction(action);
			
			cmdMsg.addCommand(command);

			datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			response = peacockTransmitter.sendMessage(datagram);
			
			List<AccountDto> accountList = new ArrayList<AccountDto>();
			AccountDto account = null;
			columns = null;
			
			lines = response.getResults().get(0).split("\n");
			for (String line : lines) {
				if (line.startsWith("#")) {
					continue;
				}
				
				if (line.contains(":")) {
					columns = line.split(":");
					
					account = new AccountDto();
					account.setMachineId(machineId);
					account.setAccount(columns[0]);
					account.setUid(Integer.parseInt(columns[2]));
					account.setGroup(groupMap.get(columns[3]));
					account.setComment(columns[4]);
					account.setHomeDir(columns[5]);
					account.setShell(columns[6]);
					accountList.add(account);
				}
			}
			
			jsonRes.setTotal(accountList.size());
			jsonRes.setList(accountList);
			jsonRes.setMsg("계정 목록 수집이 정상적으로 처리되었습니다.");
		} catch (Exception e) {
			String message = "계정 목록 수집 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance의 특정 그룹을 삭제한다.
	 * </pre>
	 * @param jsonRes
	 * @param account
	 * @return
	 */
	@RequestMapping("/removeGroup")
	public @ResponseBody DtoJsonResponse removeGroup(DtoJsonResponse jsonRes, GroupDto group) {
		Assert.notNull(group.getMachineId(), "machineId can not be null.");
		Assert.notNull(group.getGroup(), "group can not be null.");
		Assert.isTrue(group.getGid() != null && group.getGid() >= 500, "gid can not be null and greater than 499.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(group.getMachineId());
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("REMOVE_GROUP");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("groupdel");
			action.addArguments(group.getGroup());

			command.addAction(action);
			
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("Group이 정상적으로 삭제되었습니다.");
		} catch (Exception e) {
			String message = "Group 삭제 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance의 특정 계정을 삭제한다.
	 * </pre>
	 * @param jsonRes
	 * @param account
	 * @return
	 */
	@RequestMapping("/removeAccount")
	public @ResponseBody DtoJsonResponse removeAccount(DtoJsonResponse jsonRes, AccountDto account) {
		Assert.notNull(account.getMachineId(), "machineId can not be null.");
		Assert.notNull(account.getAccount(), "account can not be null.");
		Assert.isTrue(account.getUid() != null && account.getUid() >= 500, "uid can not be null and greater than 499.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(account.getMachineId());
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("REMOVE_ACCOUNT");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("userdel");
			action.addArguments("-rf " + account.getAccount());

			command.addAction(action);
			
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("Account가 정상적으로 삭제되었습니다.");
		} catch (Exception e) {
			String message = "Account 삭제 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance에 주어진 그룹을 생성한다.
	 * </pre>
	 * @param jsonRes
	 * @param account
	 * @return
	 */
	@RequestMapping("/createGroup")
	public @ResponseBody DtoJsonResponse createGroup(DtoJsonResponse jsonRes, GroupDto group) {
		Assert.notNull(group.getMachineId(), "machineId can not be null.");
		Assert.notNull(group.getGroup(), "group can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(group.getMachineId());
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("CHECK_GROUP_DUPLICATION");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("cat");
			action.addArguments("/etc/group");
			command.addAction(action);
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			String[] lines = response.getResults().get(0).split("\n");
			
			for (String line : lines) {
				if (line.contains(":")) {
					if (line.split(":")[0].equals(group.getGroup())) {
						jsonRes.setSuccess(false);
						jsonRes.setMsg("\"" + group.getGroup() + "\" 그룹이 이미 있습니다.");
						
						return jsonRes;
					}
					
					if (group.getGid() != null && line.split(":")[2].equals(Integer.toString(group.getGid()))) {
						jsonRes.setSuccess(false);
						jsonRes.setMsg("\"" + group.getGid() + "\" GID가 이미 있습니다.");
						
						return jsonRes;
					}
				}
			}
			
			cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(group.getMachineId());
			cmdMsg.setBlocking(true);
			
			sequence = 0;
			command = new Command("CREATE_GROUP");
			
			action = new ShellAction(sequence++);
			
			action.setCommand("groupadd");
			
			String args = "";

			if (group.getGid() != null && group.getGid() >= 0) {
				args += "-g " + group.getGid() + " ";
			}
			
			args += group.getGroup();	
			
			action.addArguments(args);
			command.addAction(action);			
			cmdMsg.addCommand(command);

			datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("Group이 정상적으로 생성되었습니다.");
		} catch (Exception e) {
			String message = "Group 생성 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance에 주어진 계정을 생성한다.
	 * </pre>
	 * @param jsonRes
	 * @param account
	 * @return
	 */
	@RequestMapping("/createAccount")
	public @ResponseBody DtoJsonResponse createAccount(DtoJsonResponse jsonRes, AccountDto account) {
		Assert.notNull(account.getMachineId(), "machineId can not be null.");
		Assert.notNull(account.getAccount(), "account can not be null.");
		Assert.notNull(account.getPasswd(), "passwd can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(account.getMachineId());
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("CHECK_ACCOUNT_DUPLICATION");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("cat");
			action.addArguments("/etc/passwd");
			command.addAction(action);
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			String[] lines = response.getResults().get(0).split("\n");
			
			for (String line : lines) {
				if (line.contains(":")) {
					if (line.split(":")[0].equals(account.getAccount())) {
						jsonRes.setSuccess(false);
						jsonRes.setMsg("\"" + account.getAccount() + "\" 사용자가 이미 있습니다.");
						
						return jsonRes;
					}
					
					if (account.getUid() != null && line.split(":")[2].equals(Integer.toString(account.getUid()))) {
						jsonRes.setSuccess(false);
						jsonRes.setMsg("\"" + account.getUid() + "\" UID가 이미 있습니다.");
						
						return jsonRes;
					}
				}
			}
			
			cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(account.getMachineId());
			cmdMsg.setBlocking(true);

			sequence = 0;
			command = new Command("GET_CRYPT_PASSWD");
			
			action = new ShellAction(sequence++);
			
			action.setCommand("perl");
			action.addArguments("-e 'print crypt(\"" + account.getPasswd() + "\", \"password\")'");
			command.addAction(action);
			cmdMsg.addCommand(command);

			datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			response = peacockTransmitter.sendMessage(datagram);
			
			sequence = 0;
			command = new Command("CREATE_ACCOUNT");
			
			action = new ShellAction(sequence++);
			
			action.setCommand("useradd");
			
			String args = "";

			if (StringUtils.isNotEmpty(account.getPasswd())) {
				args += "-p " + response.getResults().get(0).replaceAll("\n", "") + " ";
			}
			if (StringUtils.isNotEmpty(account.getComment())) {
				args += "-c \"" + account.getComment() + "\" ";
			}
			if (StringUtils.isNotEmpty(account.getHomeDir())) {
				args += "-d " + account.getHomeDir() + " ";
			}
			if (StringUtils.isNotEmpty(account.getShell())) {
				args += "-s " + account.getShell() + " ";
			}
			if (StringUtils.isNotEmpty(account.getGroup())) {
				args += "-g " + account.getGroup() + " ";
			}
			if (account.getGroups() != null && account.getGroups().length > 0) {
				String group = null;
				for (int i = 0; i < account.getGroups().length; i++) {
					group = account.getGroups()[i];
					
					if (i == 0) {
						args += "-G " + group;
					} else {
						args += "," + group;
					}
				}
				
				args += " ";
			}
			if (account.getUid() != null && account.getUid() >= 0) {
				args += "-u " + account.getUid() + " ";
			}
			
			args += account.getAccount();	
			
			action.addArguments(args);
			command.addAction(action);			
			cmdMsg.addCommand(command);

			datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("Account가 정상적으로 생성되었습니다.");
		} catch (Exception e) {
			String message = "Account 생성 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance의 /etc/fstab 정보를 가져온다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 */
	@RequestMapping("/getFstab")
	public @ResponseBody DtoJsonResponse getFstab(DtoJsonResponse jsonRes, String machineId) {
		Assert.notNull(machineId, "machineId can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(machineId);
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("GET_FSTAB");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("cat");
			action.addArguments("/etc/fstab");
			command.addAction(action);
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("/etc/fstab 파일을 정상적으로 조회하였습니다.");
		} catch (Exception e) {
			String message = "/etc/fstab 파일 조회 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance의 /etc/fstab 정보를 수정한다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @param contents /etc/fstab 내용
	 * @param unmounts 하나 이상의 unmount 대상 노드(',' 구분자 사용)
	 * @param remount 저장 후 mount -a 실행 여부
	 * @return
	 */
	@RequestMapping(value="/editFstab", method=RequestMethod.POST)
	public @ResponseBody DtoJsonResponse editFstab(DtoJsonResponse jsonRes, String machineId, String contents, String unmounts, boolean remount) {
		Assert.notNull(machineId, "machineId can not be null.");
		Assert.notNull(contents, "contents can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(machineId);
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("EDIT_FSTAB");
			
			FileWriteAction fwAction = new FileWriteAction(sequence++);
			fwAction.setContents(contents);
			fwAction.setFileName("/etc/fstab");
			command.addAction(fwAction);
			
			ShellAction shAction = null;
			if (StringUtils.isNotEmpty(unmounts)) {
				String[] nodes = unmounts.split(",");
				for (String node : nodes) {
					shAction = new ShellAction(sequence++);
					shAction.setCommand("umount");
					shAction.addArguments(node);
					command.addAction(shAction);
				}
			}
			
			if (remount) {
				shAction = new ShellAction(sequence++);
				shAction.setCommand("mount");
				shAction.addArguments("-a");
				command.addAction(shAction);
			}
			
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("/etc/fstab 파일이 정상적으로 수정되었습니다.");
		} catch (Exception e) {
			String message = "/etc/fstab 파일 수정 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance내 지정된 계정에 대한 crontab 정보를 조회한다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @param account 
	 * @return
	 */
	@RequestMapping("/getCrontab")
	public @ResponseBody DtoJsonResponse getCrontab(DtoJsonResponse jsonRes, String machineId, String account) {
		Assert.notNull(machineId, "machineId can not be null.");
		Assert.notNull(account, "account can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(machineId);
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("GET_CRONTAB");
			
			ShellAction action = new ShellAction(sequence++);
			
			action.setCommand("cat");
			action.addArguments("/var/spool/cron/" + account);
			command.addAction(action);
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			if (response.getResults().get(0).startsWith("cat: /var/spool/cron")) {
				jsonRes.setData("");
			} else {
				jsonRes.setData(response.getResults());
			}
			
			jsonRes.setMsg("crontab 정보를 정상적으로 조회하였습니다.");
		} catch (Exception e) {
			String message = "crontab 정보 조회 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Running 중인 Instance내 지정된 계정에 대한 crontab 정보를 저장한다.
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @param account
	 * @param contents
	 * @return
	 */
	@RequestMapping(value="/editCrontab", method=RequestMethod.POST)
	public @ResponseBody DtoJsonResponse editCrontab(DtoJsonResponse jsonRes, String machineId, String account, String contents) {
		Assert.notNull(machineId, "machineId can not be null.");
		Assert.notNull(account, "account can not be null.");
		Assert.notNull(contents, "contents can not be null.");
		
		try {
			ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
			cmdMsg.setAgentId(machineId);
			cmdMsg.setBlocking(true);

			int sequence = 0;
			Command command = new Command("EDIT_CRONTAB");
			
			FileWriteAction fwAction = new FileWriteAction(sequence++);
			fwAction.setContents(contents);
			fwAction.setFileName("/var/spool/cron/" + account);
			fwAction.setPermission("rw-------");
			command.addAction(fwAction);
			cmdMsg.addCommand(command);

			PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
			ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
			
			jsonRes.setData(response.getResults());
			jsonRes.setMsg("crontab 정보가 정상적으로 수정되었습니다.");
		} catch (Exception e) {
			String message = "crontab 정보 수정 중 에러가 발생하였습니다.";
			
			if (e.getMessage() != null && e.getMessage().equals("Channel is null.")) {
				message += "<br/>Instance와의 연결을 확인하십시오.";
			}
			
			jsonRes.setSuccess(false);
			jsonRes.setMsg(message);
			
			logger.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * Provisioning Command 실행을 위한 테스트 메소드
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/command")
	public ModelAndView command() throws Exception {
		List<MachineDto> machineList = machineService.getMachineList(new MachineDto());
		
		ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
		cmdMsg.setAgentId(machineList.get(0).getMachineId());
		cmdMsg.setBlocking(true);
		
		Command command = new Command("UNINSTALL");
		int sequence = 0;
		ShellAction action = new ShellAction(sequence++);
		action.setCommand("/bin/cat");
		action.addArguments("-n");
		action.addArguments("/etc/hosts");
		command.addAction(action);
		cmdMsg.addCommand(command);
		
		command = new Command("INSTALL");
		sequence = 0;
		action = new ShellAction(sequence++);
		action.setCommand("ls");
		action.addArguments("-al");
		action.addArguments("~/");
		command.addAction(action);
		cmdMsg.addCommand(command);
		
		command = new Command("CONFIGURATION");
		sequence = 0;
		action = new ShellAction(sequence++);
		action.setCommand("ls");
		action.addArguments("~/");
		command.addAction(action);
		cmdMsg.addCommand(command);
		
		PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
		ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
		
		ModelAndView mav = new ModelAndView();
		mav.addObject("result", response.getResults());
		
		return mav;
	}

	/**
	 * <pre>
	 * Agent에 Apache HTTP Daemon 설치를 위한 테스트 메소드
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/apache")
	public ModelAndView apache() throws Exception {
		//List<MachineDto> machineList = machineService.getMachineList(new MachineDto());
		
		String targetDir = "/usr/local/apache";
		String version = "2.2.25";
		
		ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
		cmdMsg.setAgentId("e8a478c2faff41c6a94a52540020c3a0");
		cmdMsg.setBlocking(true);
		
		Command command = new Command("Apache INSTALL");
		int sequence = 0;
		
		ShellAction s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/" + version + "/httpd-" + version + ".tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("tar");
		s_action.addArguments("xvzf");
		s_action.addArguments("httpd-" + version + ".tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version + "/srclib");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/apr-1.4.6.tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version + "/srclib");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/apr-util-1.5.2.tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version + "/srclib");
		s_action.setCommand("tar");
		s_action.addArguments("xvzf");
		s_action.addArguments("apr-1.4.6.tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version + "/srclib");
		s_action.setCommand("tar");
		s_action.addArguments("xvzf");
		s_action.addArguments("apr-util-1.5.2.tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version + "/srclib");
		s_action.setCommand("mv");
		s_action.addArguments("apr-1.4.6");
		s_action.addArguments("apr");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version + "/srclib");
		s_action.setCommand("mv");
		s_action.addArguments("apr-util-1.5.2");
		s_action.addArguments("apr-util");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setCommand("yum");
		s_action.addArguments("install");
		s_action.addArguments("-y");
//		s_action.addArguments("apr-devel");
//		s_action.addArguments("apr-util-devel");
//		s_action.addArguments("gcc");
		s_action.addArguments("pcre-devel.x86_64");
//		s_action.addArguments("zlib-devel");
//		s_action.addArguments("openssl-devel");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version);
		s_action.setCommand("./configure");
		s_action.addArguments("--prefix=" + targetDir);
		s_action.addArguments("--enable-mods-shared=most");
		s_action.addArguments("--enable-ssl");
		s_action.addArguments("--with-ssl=/usr/local/openssl");
		s_action.addArguments("--enable-modules=ssl");
		s_action.addArguments("--enable-rewrite");
		s_action.addArguments("--with-included-apr");
		s_action.addArguments("--with-included-apr-util");
		s_action.addArguments("--enable-deflate");
		s_action.addArguments("--enable-expires");
		s_action.addArguments("--enable-headers");
		s_action.addArguments("--enable-proxy");
		
		if (version.startsWith("2.2")) {
			//s_action.addArguments("--with-mpm=prefork");
			s_action.addArguments("--with-mpm=worker");
		} else if (version.startsWith("2.3") || version.startsWith("2.4")) {
			s_action.addArguments("--enable-mpms-shared=all");
		}
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version);
		s_action.setCommand("make");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/httpd-" + version);
		s_action.setCommand("make");
		s_action.addArguments("install");
		command.addAction(s_action);
		
		// Add Apache INSTALL Command
		cmdMsg.addCommand(command);
		
		command = new Command("JK Connector INSTALL");
		sequence = 0;
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/tomcat-connectors-1.2.37-src.tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("tar");
		s_action.addArguments("xvzf");
		s_action.addArguments("tomcat-connectors-1.2.37-src.tar.gz");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/tomcat-connectors-1.2.37-src/native");
		s_action.setCommand("./configure");
		s_action.addArguments("--with-apxs=" + targetDir + "/bin/apxs");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src/tomcat-connectors-1.2.37-src/native");
		s_action.setCommand("make");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setCommand("cp");
		s_action.addArguments("-f");
		s_action.addArguments("/usr/local/src/tomcat-connectors-1.2.37-src/native/apache-2.0/mod_jk.so");
		s_action.addArguments(targetDir + "/modules/mod_jk.so");
		command.addAction(s_action);
		
		// Add JK Connector INSTALL Command
		cmdMsg.addCommand(command);
		
		command = new Command("CONFIGURATION");
		sequence = 0;
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory(targetDir + "/conf");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/" + version + "/conf/httpd.conf");
		s_action.addArguments("-O");
		s_action.addArguments("httpd.conf");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory(targetDir + "/conf");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/" + version + "/conf/mod-jk.conf");
		s_action.addArguments("-O");
		s_action.addArguments("mod-jk.conf");
		command.addAction(s_action);

//		s_action = new ShellAction(sequence++);
//		s_action.setWorkingDiretory(targetDir + "/conf");
//		s_action.setCommand("wget");
//		s_action.addArguments("${RepositoryUrl}/apache/" + version + "/conf/workers.properties");
//		s_action.addArguments("-O");
//		s_action.addArguments("workers.properties");
//		command.addAction(s_action);

		FileWriteAction fw_action = new FileWriteAction(sequence++);
		fw_action.setContents("/*.jsp=loadbalancer\r\n/*.do=loadbalancer");
		fw_action.setFileName(targetDir + "/conf/workers.properties");
		command.addAction(fw_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory(targetDir + "/conf");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/" + version + "/conf/uriworkermap.properties");
		s_action.addArguments("-O");
		s_action.addArguments("uriworkermap.properties");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory(targetDir + "/conf/extra");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/apache/" + version + "/conf/httpd-mpm.conf");
		s_action.addArguments("-O");
		s_action.addArguments("httpd-mpm.conf");
		command.addAction(s_action);
		
		List<Property> properties = new ArrayList<Property>();
		Property property = new Property();
		property.setKey("ServerRoot");
		property.setValue(targetDir);
		properties.add(property);
		
		property = new Property();
		property.setKey("Port");
		property.setValue("80");
		properties.add(property);
		
		property = new Property();
		property.setKey("ServerName");
		property.setValue("localhost");
		properties.add(property);

		ConfigAction c_action = new ConfigAction(sequence++);
		c_action.setFileName(targetDir + "/conf/httpd.conf");
		c_action.setProperties(properties);
		command.addAction(c_action);
		
		// Add CONFIGURATION Command
		cmdMsg.addCommand(command);
		
		command = new Command("CHECK");
		sequence = 0;
		s_action = new ShellAction(sequence++);
		s_action.setCommand(targetDir + "/bin/apachectl");
		s_action.addArguments("-V");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand(targetDir + "/bin/apachectl");
		s_action.addArguments("-l");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand(targetDir + "/bin/apachectl");
		s_action.addArguments("start");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand("sleep");
		s_action.addArguments("1");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand("curl");
		s_action.addArguments("http://localhost");
		command.addAction(s_action);

		// Add CHECK Command
		cmdMsg.addCommand(command);

		PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
		ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
		
		ModelAndView mav = new ModelAndView();
		mav.addObject("result", response.getResults());
		
		return mav;
	}

	/**
	 * <pre>
	 * Agent에 MySQL 설치를 위한 테스트 메소드
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/mysql")
	public ModelAndView mysql() throws Exception {
		String dataDir = "/data/mysql";
		String port = "3316";
		String password = "peacock";
		
		String version = "5.5.34";
		
		if (StringUtils.isEmpty(dataDir)) {
			dataDir = "/var/lib/mysql";
		}
		
		ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
		cmdMsg.setAgentId("e8a478c2faff41c6a94a52540020c3a0");
		cmdMsg.setBlocking(true);
		
		Command command = new Command("CONFIGURATION");
		int sequence = 0;
		
		ShellAction s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/etc");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/mysql/" + version + "/my.cnf");
		s_action.addArguments("-O");
		s_action.addArguments("my.cnf");
		command.addAction(s_action);
		
		List<Property> properties = new ArrayList<Property>();
		Property property = new Property();
		property.setKey("mysql.datadir");
		property.setValue(dataDir);
		properties.add(property);
		
		property = new Property();
		property.setKey("mysql.port");
		property.setValue(port);
		properties.add(property);
		
		ConfigAction c_action = new ConfigAction(sequence++);
		c_action.setFileName("/etc/my.cnf");
		c_action.setProperties(properties);
		command.addAction(c_action);
		
		// Add CONFIGURATION Command
		cmdMsg.addCommand(command);
		
		command = new Command("MySQL INSTALL");
		sequence = 0;
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/mysql/" + version + "/MySQL-server.rpm");
		s_action.addArguments("-O");
		s_action.addArguments("MySQL-server.rpm");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/mysql/" + version + "/MySQL-client.rpm");
		s_action.addArguments("-O");
		s_action.addArguments("MySQL-client.rpm");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("rpm");
		s_action.addArguments("-Uvh");
		s_action.addArguments("MySQL-server.rpm");
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("rpm");
		s_action.addArguments("-Uvh");
		s_action.addArguments("MySQL-client.rpm");
		command.addAction(s_action);
		
		// Add MySQL INSTALL Command
		cmdMsg.addCommand(command);
		
		command = new Command("Change Password");
		sequence = 0;
		s_action = new ShellAction(sequence++);
		s_action.setCommand("service");
		s_action.addArguments("mysql");
		s_action.addArguments("start");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand("mysqladmin");
		s_action.addArguments("-u");
		s_action.addArguments("root");
		s_action.addArguments("password");
		s_action.addArguments(password);
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setCommand("mysqladmin");
		s_action.addArguments("-u");
		s_action.addArguments("root");
		s_action.addArguments("-h");
		s_action.addArguments("localhost.localdomain");
		s_action.addArguments("-P");
		s_action.addArguments(port);
		s_action.addArguments("password");
		s_action.addArguments(password);
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand("mysql");
		s_action.addArguments("-u");
		s_action.addArguments("root");
		s_action.addArguments("-p" + password);
		s_action.addArguments("-e");
		s_action.addArguments("'select User,Host,Password from mysql.user'");
		command.addAction(s_action);

		// Add Change Password Command
		cmdMsg.addCommand(command);
		
		PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
		ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
		
		ModelAndView mav = new ModelAndView();
		mav.addObject("result", response.getResults());
		
		return mav;
	}

	/**
	 * <pre>
	 * Agent에 MySQL 제거를 위한 테스트 메소드
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/mysql_init")
	public ModelAndView mysql_init() throws Exception {

		ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
		cmdMsg.setAgentId("e8a478c2faff41c6a94a52540020c3a0");
		cmdMsg.setBlocking(true);
		
		Command command = new Command("DELETE");
		int sequence = 0;
		
		ShellAction s_action = new ShellAction(sequence++);
		s_action.setCommand("service");
		s_action.addArguments("mysql");
		s_action.addArguments("stop");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand("rpm");
		s_action.addArguments("--erase");
		s_action.addArguments("MySQL-client");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand("rpm");
		s_action.addArguments("--erase");
		s_action.addArguments("MySQL-server");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setCommand("userdel");
		s_action.addArguments("-r");
		s_action.addArguments("mysql");
		command.addAction(s_action);

		// Add DELETE Command
		cmdMsg.addCommand(command);
		
		PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
		ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
		
		ModelAndView mav = new ModelAndView();
		mav.addObject("result", response.getResults());
		
		return mav;
	}

	/**
	 * <pre>
	 * Agent에 JBoss 설치를 위한 테스트 메소드
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/jboss")
	public ModelAndView jboss() throws Exception {

		ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
		cmdMsg.setAgentId("e8a478c2faff41c6a94a52540020c3a0");
		cmdMsg.setBlocking(true);
		
		/**
		 * JBoss Variables
		 */
		String jbossHome = "/peacock/jboss-as";
		String serverHome = "/peacock/servers";
		String serverName = "test1";
		String partitionName = "partition";
		String bindAddress = "0.0.0.0";
		String bindPort = "ports-default";
		
		/**
		 * DataSource Variables
		 */
		String databaseType = "mysql";
		String jndiName = "testDS";
		String connectionUrl = "jdbc:mysql:/localhost:3316/peacock";
		String userName = "root";
		String password = "peacock";
		String minPoolSize = "10";
		String maxPoolSize = "20";
		
		Command command = new Command("Pre-install");
		int sequence = 0;
		
		ShellAction s_action = new ShellAction(sequence++);
		s_action.setCommand("mkdir");
		s_action.addArguments("-p");
		s_action.addArguments(jbossHome);
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setCommand("mkdir");
		s_action.addArguments("-p");
		s_action.addArguments(serverHome);
		command.addAction(s_action);
		
		// Add Pre-install Command
		cmdMsg.addCommand(command);
		
		command = new Command("JBoss INSTALL");
		sequence = 0;
		
		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/jboss/jboss-eap-5.2.0.zip");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("unzip");
		s_action.addArguments("-o");
		s_action.addArguments("jboss-eap-5.2.0.zip");
		s_action.addArguments("-d");
		s_action.addArguments(jbossHome);
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/jboss/jboss-cluster-template-5.2.0.zip");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("unzip");
		s_action.addArguments("-o");
		s_action.addArguments("jboss-cluster-template-5.2.0.zip");
		s_action.addArguments("-d");
		s_action.addArguments(serverHome + "/" + serverName);
		command.addAction(s_action);
		
		List<Property> properties = new ArrayList<Property>();
		Property property = null;
		
		property = new Property();
		property.setKey("jboss.home");
		property.setValue(jbossHome);
		properties.add(property);
		
		property = new Property();
		property.setKey("server.home");
		property.setValue(serverHome);
		properties.add(property);
		
		property = new Property();
		property.setKey("server.name");
		property.setValue(serverName);
		properties.add(property);
		
		property = new Property();
		property.setKey("partition.name");
		property.setValue(partitionName);
		properties.add(property);
		
		property = new Property();
		property.setKey("bind.address");
		property.setValue(bindAddress);
		properties.add(property);
		
		property = new Property();
		property.setKey("bind.port");
		property.setValue(bindPort);
		properties.add(property);
		
		ConfigAction c_action = new ConfigAction(sequence++);
		c_action.setFileName(serverHome + "/" + serverName + "/bin/env.sh");
		c_action.setProperties(properties);
		command.addAction(c_action);
		
		// Add JBoss INSTALL Command
		cmdMsg.addCommand(command);
		
		command = new Command("DataSource Configuration");
		sequence = 0;

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory(serverHome + "/" + serverName);
		s_action.setCommand("wget");
		
		if (databaseType.equals("oracle")) {
			s_action.addArguments("${RepositoryUrl}/jboss/datasource/oracle-ds.xml");
		} else if (databaseType.equals("mysql")) {
			s_action.addArguments("${RepositoryUrl}/jboss/datasource/mysql-ds.xml");
		} else if (databaseType.equals("cubrid")) {
			s_action.addArguments("${RepositoryUrl}/jboss/datasource/cubrid-ds.xml");
		}
		s_action.addArguments("-O");
		s_action.addArguments(serverName + "-ds.xml");
		command.addAction(s_action);
		
		properties = new ArrayList<Property>();
		property = new Property();
		property.setKey("jndi.name");
		property.setValue(jndiName);
		properties.add(property);
		
		property = new Property();
		property.setKey("connection.url");
		property.setValue(connectionUrl);
		properties.add(property);
		
		property = new Property();
		property.setKey("user.name");
		property.setValue(userName);
		properties.add(property);
		
		property = new Property();
		property.setKey("user.password");
		property.setValue(password);
		properties.add(property);
		
		property = new Property();
		property.setKey("pool.min");
		property.setValue(minPoolSize);
		properties.add(property);
		
		property = new Property();
		property.setKey("pool.max");
		property.setValue(maxPoolSize);
		properties.add(property);
		
		c_action = new ConfigAction(sequence++);
		c_action.setFileName(serverHome + "/" + serverName + "/" + serverName + "-ds.xml");
		c_action.setProperties(properties);
		command.addAction(c_action);
		
		// Add DataSource Configuration Command
		cmdMsg.addCommand(command);
		
		PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
		ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
		
		ModelAndView mav = new ModelAndView();
		mav.addObject("result", response.getResults());
		
		return mav;
	}

	/**
	 * <pre>
	 * Agent에 Tomcat 설치를 위한 테스트 메소드
	 * </pre>
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/tomcat")
	public ModelAndView tomcat() throws Exception {

		ProvisioningCommandMessage cmdMsg = new ProvisioningCommandMessage();
		cmdMsg.setAgentId("e8a478c2faff41c6a94a52540020c3a0");
		cmdMsg.setBlocking(true);
		
		/**
		 * Tomcat Variables
		 */
		String javaHome = "";
		String serverName = "test2";
		String catalinaHome = "/peacock/tomcat";
		//String catalinaBase = "/peacock/servers/\\$SERVER_NAME";
		String catalinaBase = "/peacock/servers";
		String portOffset = "0";
		String compUser = "root";
		
		Command command = new Command("Pre-install");
		int sequence = 0;
		
		ShellAction s_action = new ShellAction(sequence++);
		s_action.setCommand("mkdir");
		s_action.addArguments("-p");
		s_action.addArguments(catalinaHome);
		command.addAction(s_action);
		
		s_action = new ShellAction(sequence++);
		s_action.setCommand("mkdir");
		s_action.addArguments("-p");
		s_action.addArguments(catalinaBase + "/" + serverName);
		command.addAction(s_action);
		
		// Add Pre-install Command
		cmdMsg.addCommand(command);
		
		command = new Command("Tomcat Install");
		sequence = 0;

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/tomcat/apache-tomcat-6.0.37.zip");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("unzip");
		s_action.addArguments("-o");
		s_action.addArguments("apache-tomcat-6.0.37.zip");
		s_action.addArguments("-d");
		s_action.addArguments(catalinaHome);
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("wget");
		s_action.addArguments("${RepositoryUrl}/tomcat/tomcat-template-6.0.37.zip");
		command.addAction(s_action);

		s_action = new ShellAction(sequence++);
		s_action.setWorkingDiretory("/usr/local/src");
		s_action.setCommand("unzip");
		s_action.addArguments("-o");
		s_action.addArguments("tomcat-template-6.0.37.zip");
		s_action.addArguments("-d");
		s_action.addArguments(catalinaBase + "/" + serverName);
		command.addAction(s_action);
		
		List<Property> properties = new ArrayList<Property>();
		Property property = null;
		
		property = new Property();
		property.setKey("java.home");
		property.setValue(javaHome);
		properties.add(property);
		
		property = new Property();
		property.setKey("server.name");
		property.setValue(serverName);
		properties.add(property);
		
		property = new Property();
		property.setKey("catalina.home");
		property.setValue(catalinaHome);
		properties.add(property);
		
		property = new Property();
		property.setKey("catalina.base");
		property.setValue(catalinaBase);
		properties.add(property);
		
		property = new Property();
		property.setKey("port.offset");
		property.setValue(portOffset);
		properties.add(property);
		
		property = new Property();
		property.setKey("comp.user");
		property.setValue(compUser);
		properties.add(property);
		
		ConfigAction c_action = new ConfigAction(sequence++);
		c_action.setFileName(catalinaBase + "/" + serverName + "/bin/env.sh");
		c_action.setProperties(properties);
		command.addAction(c_action);
		
		// Add Tomcat INSTALL Command
		cmdMsg.addCommand(command);
		
		PeacockDatagram<AbstractMessage> datagram = new PeacockDatagram<AbstractMessage>(cmdMsg);
		ProvisioningResponseMessage response = peacockTransmitter.sendMessage(datagram);
		
		ModelAndView mav = new ModelAndView();
		mav.addObject("result", response.getResults());
		
		return mav;
	}
}
// end of MachineController.java