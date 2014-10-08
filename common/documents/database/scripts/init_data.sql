use peacock;

INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_001','IDLE_CPU','%','Percentage of time that the CPU or CPUs were not processing any commands and the system did not have an outstanding disk I/O request.',null,null,1,NOW(),1,NOW());
INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_002','COMBINED_CPU','%','Percentage of CPU utilization while executing at all(system, kernel, user, application).','Y','CPU',1,NOW(),1,NOW());
INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_003','TOTAL_MEMORY','KB','Total system memory',null,null,1,NOW(),1,NOW());
INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_004','FREE_MEMORY','KB','Total free system memory',null,null,1,NOW(),1,NOW());
INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_005','USED_MEMORY','KB','Total used system memory','Y','MEMORY',1,NOW(),1,NOW());
INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_006','DISK_USAGE','%','Disk Usage per mount nodes','Y','DISK',1,NOW(),1,NOW());
INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_007','DISK_TOTAL','KB','Whole Disk Total Size',null,null,1,NOW(),1,NOW());
INSERT INTO peacock.mon_factor_tbl(MON_FACTOR_ID,MON_FACTOR_NAME,MON_FACTOR_UNIT,MON_FACTOR_DESC,AUTO_SCALING_YN,DISPLAY_NAME,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT)
VALUES ('FACTOR_008','DISK_USED','KB','Whole Disk Used Size',null,null,1,NOW(),1,NOW());

INSERT INTO peacock.software_repo_tbl (SOFTWARE_ID,SOFTWARE_NAME,SOFTWARE_VERSION,SOFTWARE_VENDOR,FILE_LOCATION,FILE_NAME,DESCRIPTION,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (1,'JBoss EWS(HTTPD)','2.2.22','Red Hat,Inc.','/repo/httpd/','jboss-ews-httpd-2.0.1.zip,jboss-ews-httpd-template.zip','HTTP Daemon',1,NOW(),1,NOW());
INSERT INTO peacock.software_repo_tbl (SOFTWARE_ID,SOFTWARE_NAME,SOFTWARE_VERSION,SOFTWARE_VENDOR,FILE_LOCATION,FILE_NAME,DESCRIPTION,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (2,'JBoss EWS(HTTPD)','2.2.26','Red Hat,Inc.','/repo/httpd/','jboss-ews-httpd-2.1.0.zip,jboss-ews-httpd-template.zip','HTTP Daemon',1,NOW(),1,NOW());
INSERT INTO peacock.software_repo_tbl (SOFTWARE_ID,SOFTWARE_NAME,SOFTWARE_VERSION,SOFTWARE_VENDOR,FILE_LOCATION,FILE_NAME,DESCRIPTION,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (3,'JBoss EWS(Tomcat)','6.0.41','Red Hat,Inc.','/repo/tomcat/','jboss-ews-as-2.1.0.zip,jboss-ews-as-template.zip','Apache Tomcat 6.0.41',1,NOW(),1,NOW());
INSERT INTO peacock.software_repo_tbl (SOFTWARE_ID,SOFTWARE_NAME,SOFTWARE_VERSION,SOFTWARE_VENDOR,FILE_LOCATION,FILE_NAME,DESCRIPTION,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (4,'JBoss EWS(Tomcat)','7.0.54','Red Hat,Inc.','/repo/tomcat/','jboss-ews-as-2.1.0.zip,jboss-ews-as-template.zip','Apache Tomcat 7.0.54',1,NOW(),1,NOW());
INSERT INTO peacock.software_repo_tbl (SOFTWARE_ID,SOFTWARE_NAME,SOFTWARE_VERSION,SOFTWARE_VENDOR,FILE_LOCATION,FILE_NAME,DESCRIPTION,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (5,'JBoss EAP','5.1.2','Red Hat,Inc.','/repo/jboss/','jboss-eap-5.1.2.zip,jboss-eap-template.zip','JBoss EAP 5.1.2',1,NOW(),1,NOW());
INSERT INTO peacock.software_repo_tbl (SOFTWARE_ID,SOFTWARE_NAME,SOFTWARE_VERSION,SOFTWARE_VENDOR,FILE_LOCATION,FILE_NAME,DESCRIPTION,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (6,'JBoss EAP','5.2.0','Red Hat,Inc.','/repo/jboss/','jboss-eap-5.2.0.zip,jboss-eap-template.zip','JBoss EAP 5.2.0',1,NOW(),1,NOW());

INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (1,1,'/repo/httpd/conf/','${INSTALL_LOCATION}/conf/','httpd.conf',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (2,1,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','httpd-info.conf',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (3,1,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','httpd-ssl.conf',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (4,1,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','uriworkermap.properties',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (5,1,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','workers.properties',NULL,1,NOW(),1,NOW());

INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (6,2,'/repo/httpd/conf/','${INSTALL_LOCATION}/conf/','httpd.conf',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (7,2,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','httpd-info.conf',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (8,2,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','httpd-ssl.conf',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (9,2,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','uriworkermap.properties',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (10,2,'/repo/httpd/conf/extra/','${INSTALL_LOCATION}/conf/extra/','workers.properties',NULL,1,NOW(),1,NOW());

INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (11,3,'/repo/tomcat/conf/','${INSTALL_LOCATION}/','env.sh',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (12,3,'/repo/tomcat/conf/','${INSTALL_LOCATION}/conf/','server.xml',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (13,3,'/repo/tomcat/conf/','${INSTALL_LOCATION}/conf/','context.xml',NULL,1,NOW(),1,NOW());

INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (14,4,'/repo/tomcat/conf/','${INSTALL_LOCATION}/','env.sh',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (15,4,'/repo/tomcat/conf/','${INSTALL_LOCATION}/conf/','server.xml',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (16,4,'/repo/tomcat/conf/','${INSTALL_LOCATION}/conf/','context.xml',NULL,1,NOW(),1,NOW());

INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (17,5,'/repo/jboss/conf/','${INSTALL_LOCATION}/','env.sh',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (18,5,'/repo/jboss/conf/','${INSTALL_LOCATION}/apps/','user-ds.xml',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (19,5,'/repo/jboss/conf/','${INSTALL_LOCATION}/conf/','login-config.xml',NULL,1,NOW(),1,NOW());

INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (20,6,'/repo/jboss/conf/','${INSTALL_LOCATION}/','env.sh',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (21,6,'/repo/jboss/conf/','${INSTALL_LOCATION}/apps/','user-ds.xml',NULL,1,NOW(),1,NOW());
INSERT INTO peacock.config_repo_tbl (CONFIG_FILE_ID,SOFTWARE_ID,CONFIG_FILE_SOURCE_LOCATION,CONFIG_FILE_TARGET_LOCATION,CONFIG_FILE_NAME,PROPERTIES,REG_USER_ID,REG_DT,UPD_USER_ID,UPD_DT) 
VALUES (22,6,'/repo/jboss/conf/','${INSTALL_LOCATION}/conf/','login-config.xml',NULL,1,NOW(),1,NOW());

INSERT INTO users_tbl (USER_ID, LOGIN_ID, PASSWD, HASHED_PASSWD, USER_NAME, DEPT_NAME, EMAIL, REG_USER_ID, REG_DT, UPD_USER_ID, UPD_DT) 
VALUES ('1', 'admin', 'admin', password('admin'), 'Administrator', '개발팀', 'admin@osci.kr', 1, NOW(), 1, NOW());
INSERT INTO users_tbl (USER_ID, LOGIN_ID, PASSWD, HASHED_PASSWD, USER_NAME, DEPT_NAME, EMAIL, REG_USER_ID, REG_DT, UPD_USER_ID, UPD_DT) 
VALUES ('2', 'admin2', 'admin2', password('admin2'), 'Administrator2', '개발팀2', 'admin2@osci.kr', 1, NOW(), 1, NOW());

INSERT INTO menu_tbl VALUES (1,'Instances','B1', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (2,'RHEV Management','B2', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (3,'ALM Management','B3', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (4,'Project','B301', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (5,'User','B302', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (6,'Group','B303', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (7,'Repository','B304', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (8,'Administration','B4', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (9,'User','B401', 1, NOW(), 1, NOW());
INSERT INTO menu_tbl VALUES (10,'User Permission','B402', 1, NOW(), 1, NOW());

INSERT INTO permission_tbl VALUES (1, 'admin', 1, NOW(), 1, NOW());
INSERT INTO permission_tbl VALUES (2, 'guest', 1, NOW(), 1, NOW());
INSERT INTO permission_tbl VALUES (3, 'osc_persons', 1, NOW(), 1, NOW());


INSERT INTO permission_menu_map_tbl VALUES(1, 1, 1, 1, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 2, 1, 1, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 3, 1, 1, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 4, 1, 1, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 5, 0, 0, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 6, 0, 0, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 7, 1, 1, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 8, 1, 1, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 9, 1, 0, 1, NOW(), 1, NOW());
INSERT INTO permission_menu_map_tbl VALUES(1, 10, 1, 1, 1, NOW(), 1, NOW());

INSERT INTO permission_user_map_tbl VALUES(1, 1, 1, NOW(), 1, NOW());
INSERT INTO permission_user_map_tbl VALUES(1, 2, 1, NOW(), 1, NOW());


set global event_scheduler = 'ON';

DROP EVENT IF EXISTS `add_time_table` ;
DROP EVENT IF EXISTS `remove_old_monitoring_data` ;
DROP EVENT IF EXISTS `remove_old_time_data` ;

CREATE EVENT `add_time_table` 
	ON SCHEDULE EVERY 1 MINUTE STARTS DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i')
	DO INSERT INTO time_tbl (REG_DT) VALUES (DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MINUTE), '%Y-%m-%d %H:%i'));

CREATE EVENT `remove_old_monitoring_data` 
	ON SCHEDULE EVERY 1 DAY STARTS DATE_FORMAT(NOW(), '%Y-%m-%d')
	DO DELETE FROM mon_data_tbl WHERE REG_DT <= DATE_SUB(NOW(), INTERVAL 30 DAY);

CREATE EVENT `remove_old_time_data` 
	ON SCHEDULE EVERY 1 DAY STARTS DATE_FORMAT(NOW(), '%Y-%m-%d')
	DO DELETE FROM time_tbl WHERE REG_DT <= DATE_SUB(NOW(), INTERVAL 30 DAY);