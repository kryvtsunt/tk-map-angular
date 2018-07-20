import { Routes, RouterModule } from '@angular/router';
import {CourseViewerComponent} from './course-viewer/course-viewer.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {SectionListComponent} from './section-list/section-list.component';
import {AdminComponent} from './admin/admin.component';
import {CourseGridComponent} from './course-grid/course-grid.component';
import {HomeComponent} from "./home/home.component";

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: '**', component: HomeComponent}
];
export const routing = RouterModule.forRoot(appRoutes);
