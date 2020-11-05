import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard]
  },
 
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./message-user/message-user.module').then(m => m.MessageUserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'activities',
    loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'communication',
    loadChildren: () => import('./communication/communication.module').then(m => m.CommunicationModule)
  },
  {
    path: 'activity-view',
    loadChildren: () => import('./activity-view/activity-view.module').then(m => m.ActivityViewModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'activity-comment',
    loadChildren: () => import('./activity-comment/activity-comment.module').then(m => m.ActivityCommentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule)
  },
  {
    path: 'new-activity',
    loadChildren: () => import('./new-activity/new-activity.module').then(m => m.NewActivityModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'activity-management',
    loadChildren: () => import('./activity-management/activity-management.module').then(m => m.ActivityManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-users',
    loadChildren: () => import('./admin-users/admin-users.module').then(m => m.AdminUsersModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'biz-kimiz',
    loadChildren: () => import('./info/info.module').then(m => m.InfoModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 