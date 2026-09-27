import { Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { AdminRoute, ProtectedRoute } from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Explore from './pages/Explore';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import ContentDetail from './pages/ContentDetail';
import Characters from './pages/Characters';
import CharacterDetail from './pages/CharacterDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Media from './pages/Media';
import Merchandise from './pages/Merchandise';
import MerchandiseDetail from './pages/MerchandiseDetail';
import Releases from './pages/Releases';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Calendar from './pages/Calendar';
import Feedback from './pages/Feedback';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Bookmarks from './pages/user/Bookmarks';
import Submissions from './pages/user/Submissions';
import SubmitContent from './pages/user/SubmitContent';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCrudPage from './pages/admin/AdminCrudPage';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminChatbot from './pages/admin/AdminChatbot';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import MotionEnhancer from './components/common/MotionEnhancer';
import ScrollToTop from './components/common/ScrollToTop';

export default function App(){
 return <>
  <ScrollToTop/>
  <MotionEnhancer/>
  <Routes>
  <Route element={<AppShell/>}>
    <Route index element={<Home/>}/>
    <Route path="explore" element={<Explore/>}/>
    <Route path="search" element={<SearchPage/>}/>
    <Route path="category/:slug" element={<CategoryPage/>}/>
    <Route path="content/:id" element={<ContentDetail/>}/>
    <Route path="characters" element={<Characters/>}/>
    <Route path="characters/:id" element={<CharacterDetail/>}/>
    <Route path="articles" element={<Articles/>}/>
    <Route path="articles/:id" element={<ArticleDetail/>}/>
    <Route path="media" element={<Media/>}/>
    <Route path="merchandise" element={<Merchandise/>}/>
    <Route path="merchandise/:id" element={<MerchandiseDetail/>}/>
    <Route path="releases" element={<Releases/>}/>
    <Route path="events" element={<Events/>}/>
    <Route path="events/:id" element={<EventDetail/>}/>
    <Route path="calendar" element={<Calendar/>}/>
    <Route path="feedback" element={<Feedback/>}/>
    <Route path="sitemap" element={<Sitemap/>}/>
    <Route path="login" element={<Login/>}/>
    <Route path="register" element={<Register/>}/>
    <Route path="forgot-password" element={<ForgotPassword/>}/>
    <Route path="reset-password/:token" element={<ResetPassword/>}/>
    <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
    <Route path="profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
    <Route path="bookmarks" element={<ProtectedRoute><Bookmarks/></ProtectedRoute>}/>
    <Route path="submissions" element={<ProtectedRoute><Submissions/></ProtectedRoute>}/>
    <Route path="submit-content" element={<ProtectedRoute><SubmitContent/></ProtectedRoute>}/>
    <Route path="*" element={<NotFound/>}/>
  </Route>
  <Route path="admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
    <Route index element={<AdminDashboard/>}/>
    <Route path="categories" element={<AdminCrudPage resource="categories"/>}/>
    <Route path="content" element={<AdminCrudPage resource="content"/>}/>
    <Route path="media" element={<AdminCrudPage resource="media"/>}/>
    <Route path="characters" element={<AdminCrudPage resource="characters"/>}/>
    <Route path="articles" element={<AdminCrudPage resource="articles"/>}/>
    <Route path="merchandise" element={<AdminCrudPage resource="merchandise"/>}/>
    <Route path="releases" element={<AdminCrudPage resource="releases"/>}/>
    <Route path="events" element={<AdminCrudPage resource="events"/>}/>
    <Route path="users" element={<AdminUsers/>}/>
    <Route path="submissions" element={<AdminSubmissions/>}/>
    <Route path="feedback" element={<AdminFeedback/>}/>
    <Route path="chatbot" element={<AdminChatbot/>}/>
    <Route path="analytics" element={<AdminAnalytics/>}/>
  </Route>
  </Routes>
 </>;
}
