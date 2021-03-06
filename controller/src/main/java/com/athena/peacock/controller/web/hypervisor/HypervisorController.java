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
package com.athena.peacock.controller.web.hypervisor;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.QueryParam;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.athena.peacock.controller.common.component.HypervisorClient;
import com.athena.peacock.controller.common.component.HypervisorClientManager;
import com.athena.peacock.controller.web.common.model.GridJsonResponse;
import com.athena.peacock.controller.web.common.model.SimpleJsonResponse;
import com.athena.peacock.controller.web.user.UserController;
import com.athena.peacock.controller.web.user.UserDto;

/**
 * <pre>
 * 하이퍼바이저 관리를 위한 컨트롤
 * </pre>
 * @author Sang-cheon Park
 * @version 1.0
 */
@Controller
@RequestMapping("/hypervisor")
public class HypervisorController {

    protected final Logger LOGGER = LoggerFactory.getLogger(HypervisorController.class);

	@Inject
	@Named("hypervisorService")
	private HypervisorService hypervisorService;

	/**
	 * <pre>
	 * 하이퍼바이저 목록 조회
	 * </pre>
	 * @param jsonRes
	 * @param machineId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/list")
	public @ResponseBody GridJsonResponse list(GridJsonResponse jsonRes) throws Exception {
		List<HypervisorDto> hypervisorList = hypervisorService.getHypervisorList();
		List<HypervisorClient> templateList = HypervisorClientManager.getAllTemplates();
		
		int matchCnt = 0;
		
		if (hypervisorList.size() == templateList.size()) {
			for (HypervisorDto hypervisor : hypervisorList) {
				for (HypervisorClient template : templateList) {
					if (hypervisor.getRhevmHost().equals(template.getHost()) &&
							hypervisor.getRhevmProtocol().equals(template.getProtocol()) &&
							hypervisor.getRhevmPort().equals(template.getPort()) &&
							hypervisor.getRhevmDomain().equals(template.getDomain()) &&
							hypervisor.getRhevmUsername().equals(template.getUsername()) &&
							hypervisor.getRhevmPassword().equals(template.getPassword())) {
						
						matchCnt++;
						break;
					}
				}
			}
		}
		
		// 기존 HypervisorClient의 갱신이 필요한 경우
		if (hypervisorList.size() != templateList.size() || hypervisorList.size() != matchCnt) {
			HypervisorClientManager.resetHypervisorClient(hypervisorList);
		}
		
		jsonRes.setTotal(hypervisorList.size());
		jsonRes.setList(hypervisorList);
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * 하이퍼바이저 생성
	 * </pre>
	 * @param request
	 * @param jsonRes
	 * @param hypervisor
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/insertHypervisor")
	public @ResponseBody SimpleJsonResponse insertHypervisor(HttpServletRequest request, SimpleJsonResponse jsonRes, HypervisorDto hypervisor) throws Exception {
		// hypervisorId는 auto increment 됨.
		
		try {
			UserDto userDto = (UserDto)request.getSession().getAttribute(UserController.SESSION_USER_KEY);
			if (userDto != null) {
				hypervisor.setRegUserId(userDto.getUserId());
				hypervisor.setUpdUserId(userDto.getUserId());
			}
			
			hypervisorService.insertHypervisor(hypervisor);
			jsonRes.setMsg("Hypervisor 생성이 완료되었습니다.");
			
			// Hypervisor가 추가될 경우 HypervisorClientManager에 해당 HypervisorClient을 초기화한다.
			HypervisorClientManager.setHypervisorClient(hypervisor);
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Hypervisor 생성 중 에러가 발생하였습니다.");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * 하이퍼바이저 조회
	 * </pre>
	 * @param request
	 * @param jsonRes
	 * @param hypervisor
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/selectHypervisor")
	public @ResponseBody SimpleJsonResponse selectHypervisor(SimpleJsonResponse jsonRes, @QueryParam("hypervisorId") Integer hypervisorId) throws Exception {
		Assert.notNull(hypervisorId, "hypervisorId can not be null.");
		
		try {
			jsonRes.setData(hypervisorService.selectHypervisor(hypervisorId));
			jsonRes.setMsg("Hypervisor 조회가 완료되었습니다.");
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Hypervisor 조회 중 에러가 발생하였습니다.");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * 하이퍼바이저 수정
	 * </pre>
	 * @param request
	 * @param jsonRes
	 * @param hypervisor
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/updateHypervisor")
	public @ResponseBody SimpleJsonResponse updateHypervisor(HttpServletRequest request, SimpleJsonResponse jsonRes, HypervisorDto hypervisor) throws Exception {
		Assert.notNull(hypervisor.getHypervisorId(), "hypervisorId can not be null.");
		
		try {
			UserDto userDto = (UserDto)request.getSession().getAttribute(UserController.SESSION_USER_KEY);
			if (userDto != null) {
				hypervisor.setRegUserId(userDto.getUserId());
				hypervisor.setUpdUserId(userDto.getUserId());
			}
			
			hypervisorService.updateHypervisor(hypervisor);
			jsonRes.setMsg("Hypervisor 수정이 완료되었습니다.");
			
			// Hypervisor가 수정될 경우 HypervisorClientManager에 해당 HypervisorClient을 초기화한다.
			HypervisorClientManager.setHypervisorClient(hypervisor);
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Hypervisor 수정 중 에러가 발생하였습니다.");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}

	/**
	 * <pre>
	 * 하이퍼바이저 삭제
	 * </pre>
	 * @param jsonRes
	 * @param hypervisorId
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/deleteHypervisor")
	public @ResponseBody SimpleJsonResponse deleteHypervisor(SimpleJsonResponse jsonRes, @QueryParam("hypervisorId") Integer hypervisorId) throws Exception {
		Assert.notNull(hypervisorId, "hypervisorId can not be null.");
		
		try {
			hypervisorService.deleteHypervisor(hypervisorId);
			jsonRes.setMsg("Hypervisor 삭제가 완료되었습니다.");

			// Hypervisor가 삭제될 경우 HypervisorClientManager에 해당 HypervisorClient을 제거한다.
			HypervisorClientManager.removeHypervisorClient(hypervisorId);
		} catch (Exception e) {
			jsonRes.setSuccess(false);
			jsonRes.setMsg("Hypervisor 삭제 중 에러가 발생하였습니다.<br/>Agent가 설치된 Instance 목록이 존재할 경우 삭제가 불가능합니다.");
			
			LOGGER.error("Unhandled Expeption has occurred. ", e);
		}
		
		return jsonRes;
	}
}
//end of HypervisorController.java