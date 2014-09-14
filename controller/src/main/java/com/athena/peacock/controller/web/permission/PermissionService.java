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
 * Bong-Jin Kwon			            First Draft.
 */
package com.athena.peacock.controller.web.permission;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.athena.peacock.controller.web.common.model.ExtjsGridParam;
import com.athena.peacock.controller.web.common.model.TreeNode;
import com.athena.peacock.controller.web.menu.MenuDto;
import com.athena.peacock.controller.web.menu.MenuService;

/**
 * <pre>
 * 
 * </pre>
 * @author Bong-Jin Kwon
 * @version 1.0
 */
@Service
public class PermissionService {

	@Autowired
	private PermissionDao dao;
	
	@Autowired
	private PermissionMenuMapDao menuMapDao;
	
	@Autowired
	private PermissionUserMapDao userMapDao;
	
	public PermissionService() {
		// TODO Auto-generated constructor stub
	}
	
	public void insertPermission(PermissionDto dto){
		dao.insertPermission(dto);
	}
	
	public void createPermission(PermissionDto dto, List<PermissionMenuMapDto> menus){
		insertPermission(dto);
		
		for (PermissionMenuMapDto permissionMenuMapDto : menus) {
			
			permissionMenuMapDto.setPermId(dto.getPermId());
			
			menuMapDao.insertPermissionMenuMap(permissionMenuMapDto);
		}
		
	}
	
	public void updateMenus(PermissionMenuMapDto dto, List<PermissionMenuMapDto> menus){
		
		menuMapDao.deletePermissionMenuMap(dto);//permId 모두 삭제함
		
		for (PermissionMenuMapDto permissionMenuMapDto : menus) {
			
			permissionMenuMapDto.setPermId(dto.getPermId());
			
			menuMapDao.insertPermissionMenuMap(permissionMenuMapDto);
		}
		
	}
	
	public List<PermissionDto> getPermissionList(ExtjsGridParam gridParam){
		return dao.getPermissionList(gridParam);
	}
	
	public int getPermissionListTotalCount(ExtjsGridParam gridParam){
		
		return dao.getPermissionListTotalCount(gridParam);
	}
	
	public List<TreeNode> getPermissionMenuList(int permId){
		
		List<MenuDto> dbList = dao.getPermissionMenuList(permId);
		
		return MenuService.convertTreeData(dbList);
	}
	
	public PermissionDto getPermission(PermissionDto param){
		return dao.getPermission(param);
	}
	
	public void updatePermission(PermissionDto param){
		dao.updatePermission(param);
	}
	
	/**
	 * <pre>
	 * permission_menu_map_tbl & permission_tbl 데이타만 삭제
	 * permission_user_map_tbl 에 data 가 없어야 함.
	 * </pre>
	 * @param param
	 */
	public void deletePermission(PermissionDto param){
		
		PermissionMenuMapDto menuMapDto = new PermissionMenuMapDto();
		menuMapDto.setPermId(param.getPermId());
		
		menuMapDao.deletePermissionMenuMap(menuMapDto);
		
		dao.deletePermission(param);
	}
	
	public void insertPermissionUser(PermissionUserMapDto param){
		userMapDao.insertPermissionUserMap(param);
	}
	
	public void deletePermissionUser(PermissionUserMapDto param){
		userMapDao.deletePermissionUserMap(param);
	}

}
//end of PermissionService.java