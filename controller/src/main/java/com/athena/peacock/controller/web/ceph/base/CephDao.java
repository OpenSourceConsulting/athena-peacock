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
 * Sang-cheon Park	2015. 10. 13.		First Draft.
 */
package com.athena.peacock.controller.web.ceph.base;

import org.springframework.stereotype.Repository;

import com.athena.peacock.controller.web.common.dao.AbstractBaseDao;

/**
 * <pre>
 * 
 * </pre>
 * @author Sang-cheon Park
 * @version 1.0
 */
@Repository("cephDao")
public class CephDao extends AbstractBaseDao {

	public void insertCeph(CephDto ceph) {
		sqlSession.insert("CephMapper.insertCeph", ceph);
	}

	public CephDto selectCeph(Integer cephId) {
		return sqlSession.selectOne("CephMapper.selectCeph", cephId);
	}
	
	public void updateCeph(CephDto ceph) {
		sqlSession.update("CephMapper.updateCeph", ceph);
	}
	
	public void deleteCeph(Integer cephId) {
		sqlSession.delete("CephMapper.deleteCeph", cephId);
	}
}
//end of CephDao.java