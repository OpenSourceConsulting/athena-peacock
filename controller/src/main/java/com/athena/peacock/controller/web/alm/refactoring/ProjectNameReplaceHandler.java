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
 * Bong-Jin Kwon	2014. 9. 25.		First Draft.
 */
package com.athena.peacock.controller.web.alm.refactoring;

import java.io.File;

import org.apache.tools.ant.taskdefs.optional.ReplaceRegExp;

/**
 * 
 * Eclispe .project 파일 수정 Handler.
 * 
 * @author Bong-Jin Kwon
 *
 */
public class ProjectNameReplaceHandler extends AbstractFileReplaceHandler {

	
	public ProjectNameReplaceHandler() {
		setFilePath(".project");
	}
	

	/* (non-Javadoc)
	 * @see com.bong.svn.project_refactor.FileReplaceHandler#replaceFile(java.lang.String, java.lang.String)
	 */
	@Override
	public void replaceFile(String projectRootDir, String projectCode) {
		
		ReplaceRegExp task = new ReplaceRegExp();
		
		task.setFile(new File(projectRootDir + File.separator + getFilePath()));
		task.setMatch("<name>(.*)</name>");
		task.setReplace("<name>"+projectCode+"</name>");
		
		task.execute();

		logger.debug("Replaced "+getFilePath()+" File!!!");

	}

}
