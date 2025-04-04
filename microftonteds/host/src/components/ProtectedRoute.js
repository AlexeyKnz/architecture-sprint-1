import React, {lazy, Suspense} from 'react';
import { Route, Redirect } from "react-router-dom";

const Profile = lazy(() => import('userprofile/Profile').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);

const Cards = lazy(() => import('cards/Cards').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
})
);

const ProtectedRoute = ({...props  }) => {
  return (
    <Route exact>
      {
        () => props.loggedIn ?
        <main className="content">
          <Suspense fallback={<div>Loading...</div>}>
           <Profile />
           <Cards/>
           </Suspense>
        </main>
        : <Redirect to="./UserAuth" />
      }
    </Route>
)}

export default ProtectedRoute;