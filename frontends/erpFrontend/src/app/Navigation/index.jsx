import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';
import logoIcon from '@/style/images/logo-icon.png';
import logoText from '@/style/images/logo-text.png';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  UserOutlined,
  ProfileOutlined,
  TeamOutlined,
  MoneyCollectOutlined,
  ProjectOutlined,
  FundProjectionScreenOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Navigation() {
  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const { current } = useSelector(selectAuth);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  const onCollapse = () => {
    navMenu.collapse();
  };
  const { role } = JSON.parse(window.localStorage.auth);
  return (
    <>
      <Sider collapsible collapsed={isNavMenuClose} onCollapse={onCollapse} className="navigation">
        <div className="logo">
          <img
            src={logoIcon}
            alt="Logo"
          // style={{ margin: "0 auto 40px", display: "block" }}
          />

          {!showLogoApp && (
            <img src={logoText} alt="Logo" style={{ marginTop: '3px', marginLeft: '10px' }} />
          )}
        </div>
        <Menu mode="inline">
          <Menu.Item key={'Dashboard'} icon={<DashboardOutlined />}>
            <Link to={'/'} />
            Dashboard
          </Menu.Item>


          {role !== 3
            &&
            <>
              <Menu.Item key={'Employee'} icon={<UserOutlined />}>
                <Link to={'/employee'} />
                Employee
              </Menu.Item>

              <Menu.Item key={'Customer'} icon={<CustomerServiceOutlined />}>
                <Link to={'/customer'} />
                Customer
              </Menu.Item>
              <Menu.Item key={'PayrollManagement'} icon={<MoneyCollectOutlined />}>
                <Link to={'/payroll_management'} />
                Payroll Management
              </Menu.Item>

              <Menu.Item key={'Projects'} icon={<ProjectOutlined />}>
                <Link to={'/projects'} />
                Projects
              </Menu.Item>

              <Menu.Item key={'ProjectPayrollManagement'} icon={<FundProjectionScreenOutlined />}>
                <Link to={'/project_payment_management'} />
                Project Payment Management
              </Menu.Item>
            </>
          }

          <Menu.Item key={'VisitControl'} icon={<ControlOutlined />}>
            <Link to={'/visit_control'} />
            Visit Control
          </Menu.Item>
          {
            role !== 3 &&

            <Menu.Item key={'StoreList'} icon={<ControlOutlined />}>
              <Link to={'/store'} />
              Store
            </Menu.Item>
          }
          {
            role === 0 &&

            <Menu.Item key={'Admin'} icon={<TeamOutlined />}>
              <Link to={'/admin'} />
              Admin
            </Menu.Item>
          }
          {
            role !== 3 &&

            <SubMenu key={'Settings'} icon={<SettingOutlined />} title={'Settings'}>
              <Menu.Item key={'Ref'}>
                <Link to={'/ref'} />
                Reference
              </Menu.Item>
            </SubMenu>
          }
        </Menu>
      </Sider>
    </>
  );
}
