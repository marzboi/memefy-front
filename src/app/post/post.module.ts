import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostlistComponent } from './postlist/postlist.component';
import { CreatepostComponent } from './createpost/createpost.component';
import { PostcardComponent } from './postcard/postcard.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdatepostComponent } from './updatepost/updatepost.component';
import { FavoritelistComponent } from './favoritelist/favoritelist.component';

@NgModule({
  declarations: [PostlistComponent, CreatepostComponent, PostcardComponent, UpdatepostComponent, FavoritelistComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule, ReactiveFormsModule],
  exports: [PostlistComponent],
})
export class PostModule {
  constructor() {}
}
