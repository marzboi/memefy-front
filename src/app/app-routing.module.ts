import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home/home.component';
import { PostlistComponent } from './post/postlist/postlist.component';
import { PostcardComponent } from './post/postcard/postcard.component';
import { CreatepostComponent } from './post/createpost/createpost.component';
import { UpdatepostComponent } from './post/updatepost/updatepost.component';
import { FavoritelistComponent } from './post/favoritelist/favoritelist.component';
import { ErrorComponent } from './layout/error/error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostlistComponent },
  { path: 'posts/:id', component: PostcardComponent },
  { path: 'post/:id', component: UpdatepostComponent },
  { path: 'create', component: CreatepostComponent },
  { path: 'favorites', component: FavoritelistComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
