import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/core/navbar/navbar.component";
import { SidebarComponent } from "./components/core/sidebar/sidebar.component";
import { AuthService } from "./services/identity/auth.service";
import { PasswordResetComponent } from "./components/authentication/password-reset/password-reset.component";
import { LoginComponent } from "./components/authentication/login/login.component";
import { SearchUsersComponent } from "./components/users/search-users/search-users.component";
import { UserDetailComponent } from "./components/users/user-detail/user-detail.component";
import { VenueProfileComponent } from "./components/venues/venue-profile/venue-profile.component";
import { CreateVenueComponent } from "./components/venues/create-venue/create-venue.component";
import { EditVenueComponent } from "./components/venues/edit-venue/edit-venue.component";
import { SearchVenuesComponent } from "./components/venues/search-venues/search-venues.component";

import { CreateInfluencerComponent } from "./components/influencers/create-influencer/create-influencer.component";
import { EditInfluencerComponent } from "./components/influencers/edit-influencer/edit-influencer.component";
import { SearchInfluencersComponent } from "./components/influencers/search-influencers/search-influencers.component";
import { InfluencerPostsComponent } from "./components/influencers/influencer-posts/influencer-posts.component";
import { InfluencerProfileComponent } from "./components/influencers/influencer-profile/influencer-profile.component";

import { CreateInfluencerPostComponent } from "./components/posts/influencers/create-influencer-post/create-influencer-post.component";
import { EditInfluencerPostComponent } from "./components/posts/influencers/edit-influencer-post/edit-influencer-post.component";
import { MyInfluencerPostsComponent } from "./components/posts/influencers/my-influencer-posts/my-influencer-posts.component";

import { TagsComponent } from "./components/tags/tags.component";

import { FlootInfluencerCreatePostComponent } from "./components/posts/floot/influencers/floot-influencer-create-post/floot-influencer-create-post.component";
import { FlootInfluencerEditPostComponent } from "./components/posts/floot/influencers/floot-influencer-edit-post/floot-influencer-edit-post.component";
import { FlootInfluencerSearchPostsComponent } from "./components/posts/floot/influencers/floot-influencer-search-posts/floot-influencer-search-posts.component";

import { FlootVenueCreatePostComponent } from "./components/posts/floot/venues/floot-venue-create-post/floot-venue-create-post.component";
import { FlootVenueEditPostComponent } from "./components/posts/floot/venues/floot-venue-edit-post/floot-venue-edit-post.component";
import { FlootVenueSearchPostsComponent } from "./components/posts/floot/venues/floot-venue-search-posts/floot-venue-search-posts.component";

import { SearchInfluencerAdminsComponent } from "./components/influencer-admins/search-influencer-admins/search-influencer-admins.component";
import { AddInfluencerAdminComponent } from "./components/influencer-admins/add-influencer-admin/add-influencer-admin.component";
import { EditInfluencerAdminComponent } from "./components/influencer-admins/edit-influencer-admin/edit-influencer-admin.component";

import { AddInfluencerTeamMemberComponent } from "./components/influencer-team/add-influencer-team-member/add-influencer-team-member.component";
import { EditInfluencerTeamMemberComponent } from "./components/influencer-team/edit-influencer-team-member/edit-influencer-team-member.component";
import { SearchInfluencerTeamComponent } from "./components/influencer-team/search-influencer-team/search-influencer-team.component";

import { VenuePostsComponent } from "./components/venues/venue-posts/venue-posts.component";
import { ViewTeamAccountsComponent } from "./components/floot-team/view-team-accounts/view-team-accounts.component";
import { AddTeamMemberComponent } from "./components/floot-team/add-team-member/add-team-member.component";
import { EditTeamMemberComponent } from "./components/floot-team/edit-team-member/edit-team-member.component";
import { SearchVenueAdminsComponent } from "./components/venue-admins/search-venue-admins/search-venue-admins.component";
import { AddVenueAdminComponent } from "./components/venue-admins/add-venue-admin/add-venue-admin.component";
import { EditVenueAdminComponent } from "./components/venue-admins/edit-venue-admin/edit-venue-admin.component";
import { ConfirmResetPasswordComponent } from "./components/authentication/confirm-reset-password/confirm-reset-password.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { EditUserComponent } from "./components/users/edit-user/edit-user.component";
import { SearchReportedActivityComponent } from "./components/reported-activity/search-reported-activity/search-reported-activity.component";
import { TicketDetailComponent } from "./components/reported-activity/ticket-detail/ticket-detail.component";
import { MyVenuePostsComponent } from "./components/posts/venues/my-venue-posts/my-venue-posts.component";
import { CreateVenuePostComponent } from "./components/posts/venues/create-venue-post/create-venue-post.component";
import { EditVenuePostComponent } from "./components/posts/venues/edit-venue-post/edit-venue-post.component";
import { SearchVenueTeamComponent } from "./components/venue-team/search-venue-team/search-venue-team.component";
import { AddVenueTeamMemberComponent } from "./components/venue-team/add-venue-team-member/add-venue-team-member.component";
import { EditVenueTeamMemberComponent } from "./components/venue-team/edit-venue-team-member/edit-venue-team-member.component";
import { SearchNotificationsComponent } from "./components/notifications/search-notifications/search-notifications.component";
import { SendNotificationComponent } from "./components/notifications/send-notification/send-notification.component";
import { SearchSupportTicketsComponent } from "./components/support-tickets/search-support-tickets/search-support-tickets.component";
import { SupportTicketDetailComponent } from "./components/support-tickets/support-ticket-detail/support-ticket-detail.component";
import { CreateSupportTicketComponent } from "./components/support-tickets/create-support-ticket/create-support-ticket.component";
import { ViewAccountComponent } from "./components/account/view-account/view-account.component";
import { ViewRecommendedSearchesComponent } from "./components/recommended-searches/view-recommended-searches/view-recommended-searches.component";
import { CreateRecommendedSearchComponent } from "./components/recommended-searches/create-recommended-search/create-recommended-search.component";
import { EditRecommendedSearchComponent } from "./components/recommended-searches/edit-recommended-search/edit-recommended-search.component";
import { ViewPolicyComponent } from "./components/policies/view-policy/view-policy.component";
import { EditPolicyComponent } from "./components/policies/edit-policy/edit-policy.component";
import { ViewSuppliersComponent } from "./components/suppliers/view-suppliers/view-suppliers.component";
import { SupplierListComponent } from "./components/suppliers/supplier-list/supplier-list.component";
import { SupplierProfileComponent } from "./components/suppliers/supplier-profile/supplier-profile.component";
import { CreateSupplierComponent } from "./components/suppliers/create-supplier/create-supplier.component";
import { EditSupplierComponent } from "./components/suppliers/edit-supplier/edit-supplier.component";
import { AddSupplierAdminComponent } from "./components/supplier-admins/add-supplier-admin/add-supplier-admin.component";
import { EditSupplierAdminComponent } from "./components/supplier-admins/edit-supplier-admin/edit-supplier-admin.component";
import { SearchSupplierAdminsComponent } from "./components/supplier-admins/search-supplier-admins/search-supplier-admins.component";
import { SearchSupplierTeamComponent } from "./components/supplier-team/search-supplier-team/search-supplier-team.component";
import { AddSupplierTeamMemberComponent } from "./components/supplier-team/add-supplier-team-member/add-supplier-team-member.component";
import { EditSupplierTeamMemberComponent } from "./components/supplier-team/edit-supplier-team-member/edit-supplier-team-member.component";
import { SupplierSpaceComponent } from "./components/supplier-space/supplier-space.component";
import { VenueHandlerService } from "./services/identity/venue-handler.service";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SectionContainerComponent } from "./containers/section-container/section-container.component";
import { MatButtonModule } from "@angular/material/button";
import { BasicInfoContainerComponent } from "./containers/basic-info-container/basic-info-container.component";
import { GalleryImagesContainerComponent } from "./containers/gallery-images-container/gallery-images-container.component";
import { MenuContainerComponent } from "./containers/menu-container/menu-container.component";
import { OpeningTimesContainerComponent } from "./containers/opening-times-container/opening-times-container.component";
import { TagsContainerComponent } from "./containers/tags-container/tags-container.component";
import { VrmInfoContainerComponent } from "./containers/vrm-info-container/vrm-info-container.component";
import { PostsContainerComponent } from "./containers/posts-container/posts-container.component";
import { VenueAdminContainerComponent } from "./containers/venue-admin-container/venue-admin-container.component";
import { VenuePostsTableComponent } from "./tables/venue-posts-table/venue-posts-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FlootVenuePostsTableComponent } from "./tables/floot-venue-posts-table/floot-venue-posts-table.component";
import { ContactInfoContainerComponent } from "./containers/contact-info-container/contact-info-container.component";
import { ExternalLinkContainerComponent } from "./containers/external-link-container/external-link-container.component";
import { DeleteModalComponent } from "./modals/delete-modal/delete-modal.component";
import { EditOpeningTimesModalComponent } from "./modals/edit-opening-times-modal/edit-opening-times-modal.component";
import { UpdateTagsModalComponent } from "./modals/update-tags-modal/update-tags-modal.component";
import { UpdateExternalLinkModalComponent } from "./modals/update-external-link-modal/update-external-link-modal.component";
import { UpdateContactInfoModalComponent } from "./modals/update-contact-info-modal/update-contact-info-modal.component";
import { UpdateVrmInfoModalComponent } from "./modals/update-vrm-info-modal/update-vrm-info-modal.component";
import { DragAndDropDirective } from "./directives//drag-and-drop/drag-and-drop.directive";
import { AddImageModalComponent } from "./modals/add-image-modal/add-image-modal.component";
import { AddMenuModalComponent } from "./modals/add-menu-modal/add-menu-modal.component";
import { SalesComponent } from "./components/dashboard/sales/sales.component";
import { OverheadsComponent } from "./components/dashboard/overheads/overheads.component";
import { WeatherWidgetComponent } from "./components/dashboard/weather-widget/weather-widget.component";
import { CalendarComponent } from "./components/dashboard/calendar/calendar.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { DashTileComponent } from "./components/dashboard/dash-tile/dash-tile.component";
import { TimeFramePickerComponent } from "./components/dashboard/time-frame-picker/time-frame-picker.component";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { OutgoingsComponent } from "./components/dashboard/outgoings/outgoings.component";
import { MarginTrackerComponent } from "./components/dashboard/margin-tracker/margin-tracker.component";
import { SelectedProductComponent } from "./components/dashboard/gp-calculator/selected-product/selected-product.component";
import { GpCalculatorContainerComponent } from "./components/dashboard/gp-calculator/gp-calculator-container/gp-calculator-container.component";
import { ProductListComponent } from "./components/dashboard/gp-calculator/product-list/product-list.component";
import { ProductComponent } from "./components/dashboard/gp-calculator/product/product.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxDropzoneModule } from "ngx-dropzone";
import { InvoiceDropComponent } from "./components/dashboard/invoice-drop/invoice-drop.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { MatRadioModule } from "@angular/material/radio";
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { NgChartsModule } from "ng2-charts";
import { IngredientComponent } from "./components/dashboard/gp-calculator/ingredient/ingredient.component";
import { SalesEntryModalComponent } from './components/dashboard/modals/sales-entry-modal/sales-entry-modal.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { ProductsComponent } from './components/dashboard/products/products.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false,
};
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    PasswordResetComponent,
    SearchUsersComponent,
    UserDetailComponent,
    VenueProfileComponent,
    CreateVenueComponent,
    EditVenueComponent,
    SearchVenuesComponent,

    CalendarComponent,
    WeatherWidgetComponent,
    SalesComponent,
    OverheadsComponent,
    DashTileComponent,
    TimeFramePickerComponent,
    OutgoingsComponent,

    GpCalculatorContainerComponent,
    MarginTrackerComponent,

    SelectedProductComponent,
    ProductListComponent,
    ProductComponent,
    InvoiceDropComponent,
    CreateInfluencerComponent,
    EditInfluencerComponent,
    SearchInfluencersComponent,
    InfluencerPostsComponent,
    InfluencerProfileComponent,

    TagsComponent,

    FlootInfluencerCreatePostComponent,
    FlootInfluencerEditPostComponent,
    FlootInfluencerSearchPostsComponent,

    AddInfluencerTeamMemberComponent,
    EditInfluencerTeamMemberComponent,
    SearchInfluencerTeamComponent,

    FlootVenueCreatePostComponent,
    FlootVenueEditPostComponent,
    FlootVenueSearchPostsComponent,

    VenuePostsComponent,
    ViewTeamAccountsComponent,
    AddTeamMemberComponent,
    EditTeamMemberComponent,
    SearchVenueAdminsComponent,
    AddVenueAdminComponent,
    EditVenueAdminComponent,
    ConfirmResetPasswordComponent,
    EditUserComponent,
    SearchReportedActivityComponent,
    TicketDetailComponent,
    MyVenuePostsComponent,
    CreateVenuePostComponent,
    EditVenuePostComponent,

    MyInfluencerPostsComponent,
    CreateInfluencerPostComponent,
    EditInfluencerPostComponent,

    SearchInfluencerAdminsComponent,
    AddInfluencerAdminComponent,
    EditInfluencerAdminComponent,

    SearchVenueTeamComponent,
    AddVenueTeamMemberComponent,
    EditVenueTeamMemberComponent,
    SearchNotificationsComponent,
    SendNotificationComponent,
    SearchSupportTicketsComponent,
    SupportTicketDetailComponent,
    CreateSupportTicketComponent,
    ViewAccountComponent,
    ViewRecommendedSearchesComponent,
    CreateRecommendedSearchComponent,
    EditRecommendedSearchComponent,
    ViewPolicyComponent,
    EditPolicyComponent,
    ViewSuppliersComponent,
    SupplierListComponent,
    SupplierProfileComponent,
    CreateSupplierComponent,
    EditSupplierComponent,
    AddSupplierAdminComponent,
    EditSupplierAdminComponent,
    SearchSupplierAdminsComponent,
    SearchSupplierTeamComponent,
    AddSupplierTeamMemberComponent,
    EditSupplierTeamMemberComponent,
    SupplierSpaceComponent,
    SectionContainerComponent,
    BasicInfoContainerComponent,
    GalleryImagesContainerComponent,
    MenuContainerComponent,
    OpeningTimesContainerComponent,
    TagsContainerComponent,
    VrmInfoContainerComponent,
    PostsContainerComponent,
    VenueAdminContainerComponent,
    VenuePostsTableComponent,
    FlootVenuePostsTableComponent,
    ContactInfoContainerComponent,
    ExternalLinkContainerComponent,
    DeleteModalComponent,
    EditOpeningTimesModalComponent,
    UpdateTagsModalComponent,
    UpdateExternalLinkModalComponent,
    UpdateContactInfoModalComponent,
    UpdateVrmInfoModalComponent,
    DragAndDropDirective,
    AddImageModalComponent,
    AddMenuModalComponent,
    IngredientComponent,
    SalesEntryModalComponent,
    HomeComponent,
    ProductsComponent,
  ],
  imports: [
    MatRadioModule,
    PerfectScrollbarModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    GooglePlaceModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatDatepickerModule,
    NgApexchartsModule,
    MatNativeDateModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatSlideToggleModule,
    NgxDropzoneModule,
    NgChartsModule,

    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [CalendarComponent],
  providers: [
    AuthService,
    VenueHandlerService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
