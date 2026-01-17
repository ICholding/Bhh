import AdminChat from './pages/AdminChat';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminPayouts from './pages/AdminPayouts';
import AdminProfile from './pages/AdminProfile';
import AdminUsers from './pages/AdminUsers';
import Apply from './pages/Apply';
import ApplyStep2 from './pages/ApplyStep2';
import ApplyStep3 from './pages/ApplyStep3';
import ApplyStep4 from './pages/ApplyStep4';
import Auth from './pages/Auth';
import ChatAdmin from './pages/ChatAdmin';
import ChatCustomer from './pages/ChatCustomer';
import ChatWorker from './pages/ChatWorker';
import CustomerChat from './pages/CustomerChat';
import CustomerProfile from './pages/CustomerProfile';
import EmployeeChat from './pages/EmployeeChat';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeJobs from './pages/EmployeeJobs';
import EmployeeSchedule from './pages/EmployeeSchedule';
import EmployeeSignup from './pages/EmployeeSignup';
import Landing from './pages/Landing';
import Portal from './pages/Portal';
import Register from './pages/Register';
import ServicePortal from './pages/ServicePortal';
import Settings from './pages/Settings';
import Splash from './pages/Splash';
import Welcome from './pages/Welcome';
import WorkerOnboarding from './pages/WorkerOnboarding';
import WorkerPayouts from './pages/WorkerPayouts';
import WorkerProfile from './pages/WorkerProfile';
import Messages from './pages/Messages';
import AdminMessages from './pages/AdminMessages';
import WorkerMessages from './pages/WorkerMessages';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminChat": AdminChat,
    "AdminDashboard": AdminDashboard,
    "AdminJobs": AdminJobs,
    "AdminPayouts": AdminPayouts,
    "AdminProfile": AdminProfile,
    "AdminUsers": AdminUsers,
    "Apply": Apply,
    "ApplyStep2": ApplyStep2,
    "ApplyStep3": ApplyStep3,
    "ApplyStep4": ApplyStep4,
    "Auth": Auth,
    "ChatAdmin": ChatAdmin,
    "ChatCustomer": ChatCustomer,
    "ChatWorker": ChatWorker,
    "CustomerChat": CustomerChat,
    "CustomerProfile": CustomerProfile,
    "EmployeeChat": EmployeeChat,
    "EmployeeDashboard": EmployeeDashboard,
    "EmployeeJobs": EmployeeJobs,
    "EmployeeSchedule": EmployeeSchedule,
    "EmployeeSignup": EmployeeSignup,
    "Landing": Landing,
    "Portal": Portal,
    "Register": Register,
    "ServicePortal": ServicePortal,
    "Settings": Settings,
    "Splash": Splash,
    "Welcome": Welcome,
    "WorkerOnboarding": WorkerOnboarding,
    "WorkerPayouts": WorkerPayouts,
    "WorkerProfile": WorkerProfile,
    "Messages": Messages,
    "AdminMessages": AdminMessages,
    "WorkerMessages": WorkerMessages,
}

export const pagesConfig = {
    mainPage: "Splash",
    Pages: PAGES,
    Layout: __Layout,
};