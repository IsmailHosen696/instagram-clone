import { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthContexts';
import Spinner from './components/gen/Spinner';
const Signin = lazy(() => import('./components/auth/Signin'));
const Signup = lazy(() => import('./components/auth/Signup'));
const Forgetpassword = lazy(() => import('./components/auth/Forgetpassword'));
const Privateroute = lazy(() => import('./components/auth/Privateroute'));
const Home = lazy(() => import('./components/gen/Home'));
const AddPost = lazy(() => import('./components/pages/AddPost'));
const Profile = lazy(() => import('./components/pages/Profile'));
const OtherProfile = lazy(() => import('./components/pages/OtherProfile'));
const Search = lazy(() => import('./components/pages/Search'));
const UpdateProfile = lazy(() => import('./components/pages/UpdateProfile'));
const Settings = lazy(() => import('./components/pages/Settings'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Privateroute exact path='/' component={Home} />
            <Privateroute path='/profile' component={Profile} />
            <Privateroute path='/p/:username' component={OtherProfile} />
            <Privateroute path='/post' component={AddPost} />
            <Privateroute path='/updateprofile' component={UpdateProfile} />
            <Privateroute path='/settings' component={Settings} />
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/search' component={Search} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/forgetpassword' component={Forgetpassword} />
          </Switch>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
