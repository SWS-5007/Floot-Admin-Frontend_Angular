import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewAccountComponent } from "./components/account/view-account/view-account.component";
import { ConfirmResetPasswordComponent } from "./components/authentication/confirm-reset-password/confirm-reset-password.component";
import { LoginComponent } from "./components/authentication/login/login.component";
import { PasswordResetComponent } from "./components/authentication/password-reset/password-reset.component";
import { AddTeamMemberComponent } from "./components/floot-team/add-team-member/add-team-member.component";
import { EditTeamMemberComponent } from "./components/floot-team/edit-team-member/edit-team-member.component";
import { ViewTeamAccountsComponent } from "./components/floot-team/view-team-accounts/view-team-accounts.component";
import { SearchNotificationsComponent } from "./components/notifications/search-notifications/search-notifications.component";
import { SendNotificationComponent } from "./components/notifications/send-notification/send-notification.component";
import { EditPolicyComponent } from "./components/policies/edit-policy/edit-policy.component";
import { ViewPolicyComponent } from "./components/policies/view-policy/view-policy.component";

import { FlootInfluencerCreatePostComponent } from "./components/posts/floot/influencers/floot-influencer-create-post/floot-influencer-create-post.component";
import { FlootInfluencerEditPostComponent } from "./components/posts/floot/influencers/floot-influencer-edit-post/floot-influencer-edit-post.component";
import { FlootInfluencerSearchPostsComponent } from "./components/posts/floot/influencers/floot-influencer-search-posts/floot-influencer-search-posts.component";

import { FlootVenueCreatePostComponent } from "./components/posts/floot/venues/floot-venue-create-post/floot-venue-create-post.component";
import { FlootVenueEditPostComponent } from "./components/posts/floot/venues/floot-venue-edit-post/floot-venue-edit-post.component";
import { FlootVenueSearchPostsComponent } from "./components/posts/floot/venues/floot-venue-search-posts/floot-venue-search-posts.component";

import { CreateVenuePostComponent } from "./components/posts/venues/create-venue-post/create-venue-post.component";
import { EditVenuePostComponent } from "./components/posts/venues/edit-venue-post/edit-venue-post.component";
import { MyVenuePostsComponent } from "./components/posts/venues/my-venue-posts/my-venue-posts.component";

import { SearchInfluencerAdminsComponent } from "./components/influencer-admins/search-influencer-admins/search-influencer-admins.component";
import { AddInfluencerAdminComponent } from "./components/influencer-admins/add-influencer-admin/add-influencer-admin.component";
import { EditInfluencerAdminComponent } from "./components/influencer-admins/edit-influencer-admin/edit-influencer-admin.component";

import { CreateInfluencerPostComponent } from "./components/posts/influencers/create-influencer-post/create-influencer-post.component";
import { EditInfluencerPostComponent } from "./components/posts/influencers/edit-influencer-post/edit-influencer-post.component";
import { MyInfluencerPostsComponent } from "./components/posts/influencers/my-influencer-posts/my-influencer-posts.component";

import { AddInfluencerTeamMemberComponent } from "./components/influencer-team/add-influencer-team-member/add-influencer-team-member.component";
import { EditInfluencerTeamMemberComponent } from "./components/influencer-team/edit-influencer-team-member/edit-influencer-team-member.component";
import { SearchInfluencerTeamComponent } from "./components/influencer-team/search-influencer-team/search-influencer-team.component";

import { CreateRecommendedSearchComponent } from "./components/recommended-searches/create-recommended-search/create-recommended-search.component";
import { EditRecommendedSearchComponent } from "./components/recommended-searches/edit-recommended-search/edit-recommended-search.component";
import { ViewRecommendedSearchesComponent } from "./components/recommended-searches/view-recommended-searches/view-recommended-searches.component";
import { SearchReportedActivityComponent } from "./components/reported-activity/search-reported-activity/search-reported-activity.component";
import { TicketDetailComponent } from "./components/reported-activity/ticket-detail/ticket-detail.component";
import { AddSupplierAdminComponent } from "./components/supplier-admins/add-supplier-admin/add-supplier-admin.component";
import { EditSupplierAdminComponent } from "./components/supplier-admins/edit-supplier-admin/edit-supplier-admin.component";
import { SearchSupplierAdminsComponent } from "./components/supplier-admins/search-supplier-admins/search-supplier-admins.component";
import { SupplierSpaceComponent } from "./components/supplier-space/supplier-space.component";
import { AddSupplierTeamMemberComponent } from "./components/supplier-team/add-supplier-team-member/add-supplier-team-member.component";
import { EditSupplierTeamMemberComponent } from "./components/supplier-team/edit-supplier-team-member/edit-supplier-team-member.component";
import { SearchSupplierTeamComponent } from "./components/supplier-team/search-supplier-team/search-supplier-team.component";
import { CreateSupplierComponent } from "./components/suppliers/create-supplier/create-supplier.component";
import { EditSupplierComponent } from "./components/suppliers/edit-supplier/edit-supplier.component";
import { SupplierListComponent } from "./components/suppliers/supplier-list/supplier-list.component";
import { SupplierProfileComponent } from "./components/suppliers/supplier-profile/supplier-profile.component";
import { CreateSupportTicketComponent } from "./components/support-tickets/create-support-ticket/create-support-ticket.component";
import { SearchSupportTicketsComponent } from "./components/support-tickets/search-support-tickets/search-support-tickets.component";
import { SupportTicketDetailComponent } from "./components/support-tickets/support-ticket-detail/support-ticket-detail.component";
import { TagsComponent } from "./components/tags/tags.component";
import { OverheadsComponent } from "./components/dashboard/overheads/overheads.component";
import { EditUserComponent } from "./components/users/edit-user/edit-user.component";
import { SearchUsersComponent } from "./components/users/search-users/search-users.component";
import { UserDetailComponent } from "./components/users/user-detail/user-detail.component";
import { AddVenueAdminComponent } from "./components/venue-admins/add-venue-admin/add-venue-admin.component";
import { EditVenueAdminComponent } from "./components/venue-admins/edit-venue-admin/edit-venue-admin.component";
import { SearchVenueAdminsComponent } from "./components/venue-admins/search-venue-admins/search-venue-admins.component";
import { AddVenueTeamMemberComponent } from "./components/venue-team/add-venue-team-member/add-venue-team-member.component";
import { EditVenueTeamMemberComponent } from "./components/venue-team/edit-venue-team-member/edit-venue-team-member.component";
import { SearchVenueTeamComponent } from "./components/venue-team/search-venue-team/search-venue-team.component";

import { CreateVenueComponent } from "./components/venues/create-venue/create-venue.component";
import { EditVenueComponent } from "./components/venues/edit-venue/edit-venue.component";
import { SearchVenuesComponent } from "./components/venues/search-venues/search-venues.component";
import { VenuePostsComponent } from "./components/venues/venue-posts/venue-posts.component";
import { VenueProfileComponent } from "./components/venues/venue-profile/venue-profile.component";

import { CreateInfluencerComponent } from "./components/influencers/create-influencer/create-influencer.component";
import { EditInfluencerComponent } from "./components/influencers/edit-influencer/edit-influencer.component";
import { SearchInfluencersComponent } from "./components/influencers/search-influencers/search-influencers.component";
import { InfluencerPostsComponent } from "./components/influencers/influencer-posts/influencer-posts.component";
import { InfluencerProfileComponent } from "./components/influencers/influencer-profile/influencer-profile.component";

import { RoleGuard } from "./guards/role.guard";
import { SalesComponent } from "./components/dashboard/sales/sales.component";
import { MarginTrackerComponent } from "./components/dashboard/margin-tracker/margin-tracker.component";
import { OutgoingsComponent } from "./components/dashboard/outgoings/outgoings.component";
import { GpCalculatorContainerComponent } from "./components/dashboard/gp-calculator/gp-calculator-container/gp-calculator-container.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/dashboard/home/home.component";
import { ProductsComponent } from "./components/dashboard/products/products.component";

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'users',
  //   pathMatch: 'full'
  // },

  {
    path: "authentication/sign-in",
    component: LoginComponent,
  },
  {
    path: "authentication/reset-password",
    component: PasswordResetComponent,
  },
  {
    path: "authentication/reset-password/:passwordResetToken",
    component: ConfirmResetPasswordComponent,
  },

  {
    path: "account/view-account",
    component: ViewAccountComponent,
  },

  {
    path: "floot-team",
    component: ViewTeamAccountsComponent,
  },
  {
    path: "floot-team/add-team-member",
    component: AddTeamMemberComponent,
  },
  {
    path: "floot-team/edit-team-member/:accountId",
    component: EditTeamMemberComponent,
  },

  {
    path: "notifications",
    component: SearchNotificationsComponent,
  },
  {
    path: "notifications/send-notification",
    component: SendNotificationComponent,
  },

  {
    path: "policies/:policyId",
    component: ViewPolicyComponent,
  },
  {
    path: "policies/:policyId/edit-policy",
    component: EditPolicyComponent,
  },

  {
    path: "posts/venue",
    component: FlootVenueSearchPostsComponent,
  },
  {
    path: "posts/venue/create-post",
    component: FlootVenueCreatePostComponent,
  },
  {
    path: "posts/venue/edit-post/:postId",
    component: FlootVenueEditPostComponent,
  },

  {
    path: "posts/influencer",
    component: FlootInfluencerSearchPostsComponent,
  },
  {
    path: "posts/influencer/create-post",
    component: FlootInfluencerCreatePostComponent,
  },
  {
    path: "posts/influencer/edit-post/:postId",
    component: FlootInfluencerEditPostComponent,
  },

  {
    path: "venue-posts",
    component: MyVenuePostsComponent,
    canActivate: [RoleGuard],
    data: { roles: 2 },
  },
  {
    path: "venue-posts/create-post",
    component: CreateVenuePostComponent,
    canActivate: [RoleGuard],
    data: { roles: 2 },
  },
  {
    path: "venue-posts/edit-post/:postId",
    component: EditVenuePostComponent,
    canActivate: [RoleGuard],
    data: { roles: 2 },
  },

  {
    path: "influencer-posts",
    component: MyInfluencerPostsComponent,
    canActivate: [RoleGuard],
    data: { roles: 4 },
  },
  {
    path: "influencer-posts/create-post",
    component: CreateInfluencerPostComponent,
    canActivate: [RoleGuard],
    data: { roles: 4 },
  },
  {
    path: "influencer-posts/edit-post/:postId",
    component: EditInfluencerPostComponent,
    canActivate: [RoleGuard],
    data: { roles: 4 },
  },

  {
    path: "recommended-searches",
    component: ViewRecommendedSearchesComponent,
  },
  {
    path: "recommended-searches/create-recommended-search",
    component: CreateRecommendedSearchComponent,
  },
  {
    path: "recommended-searches/edit-recommended-search/:searchId",
    component: EditRecommendedSearchComponent,
  },

  {
    path: "reported-activity",
    component: SearchReportedActivityComponent,
  },
  {
    path: "reported-activity/ticket/:ticketId",
    component: TicketDetailComponent,
  },

  {
    path: "support-tickets",
    component: SearchSupportTicketsComponent,
  },
  {
    path: "support-tickets/ticket/:ticketId",
    component: SupportTicketDetailComponent,
  },
  {
    path: "support-tickets/create-ticket",
    component: CreateSupportTicketComponent,
  },

  {
    path: "tags",
    component: TagsComponent,
  },
   {
    path: "over-heads",
    component: OverheadsComponent,
   },
  {
    path: "users",
    component: SearchUsersComponent,
  },
  {
    path: "users/:userId",
    component: UserDetailComponent,
  },
  {
    path: "users/:userId/edit-user",
    component: EditUserComponent,
  },

  {
    path: "venues",
    component: SearchVenuesComponent,
  },
  {
    path: "venues/profile/:venueId",
    component: VenueProfileComponent,
  },
  {
    path: "dashboard/demo",
    component: DashboardComponent,
  },
  {
    path: "dashboard/home",
    component: HomeComponent,
  },
  {
    path: "dashboard/sales",
    component: SalesComponent,
  },
  {
    path: "dashboard/outgoing",
    component: OutgoingsComponent,
  },
  {
    path: "dashboard/gp-calculator",
    component: GpCalculatorContainerComponent,
  },
  {
    path: "dashboard/margin-tracker",
    component: MarginTrackerComponent,
  },
  {
    path: "dashboard/products",
    component: ProductsComponent,
  },
  {
    path: "venue-profile",
    component: VenueProfileComponent,
  },
  {
    path: "venues/posts/:venueId",
    component: VenuePostsComponent,
  },
  {
    path: "venues/create-venue",
    component: CreateVenueComponent,
  },
  {
    path: "venues/edit-venue/:venueId",
    component: EditVenueComponent,
  },

  {
    path: "influencer-admins",
    component: SearchInfluencerAdminsComponent,
  },
  {
    path: "influencer-admins/add-influencer-admin",
    component: AddInfluencerAdminComponent,
  },
  {
    path: "influencer-admins/edit-influencer-admin/:accountId",
    component: EditInfluencerAdminComponent,
  },

  {
    path: "influencer-team",
    component: SearchInfluencerTeamComponent,
  },
  {
    path: "influencer-team/add-influencer-team-member",
    component: AddInfluencerTeamMemberComponent,
  },
  {
    path: "influencer-team/edit-influencer-team-member/:accountId",
    component: EditInfluencerTeamMemberComponent,
  },

  {
    path: "influencers",
    component: SearchInfluencersComponent,
  },
  {
    path: "influencers/profile/:influencerId",
    component: InfluencerProfileComponent,
  },
  {
    path: "influencer-profile",
    component: InfluencerProfileComponent,
  },
  {
    path: "influencers/posts/:influencerId",
    component: InfluencerPostsComponent,
  },
  {
    path: "influencers/create-influencer",
    component: CreateInfluencerComponent,
  },
  {
    path: "influencers/edit-influencer/:influencerId",
    component: EditInfluencerComponent,
  },

  {
    path: "venue-admins",
    component: SearchVenueAdminsComponent,
  },
  {
    path: "venue-admins/add-venue-admin",
    component: AddVenueAdminComponent,
  },
  {
    path: "venue-admins/edit-venue-admin/:accountId",
    component: EditVenueAdminComponent,
  },

  {
    path: "venue-team",
    component: SearchVenueTeamComponent,
  },
  {
    path: "venue-team/add-venue-team-member",
    component: AddVenueTeamMemberComponent,
  },
  {
    path: "venue-team/edit-venue-team-member/:accountId",
    component: EditVenueTeamMemberComponent,
  },

  {
    path: "supplier-list",
    component: SupplierListComponent,
  },
  {
    path: "supplier-list/profile/:supplierId",
    component: SupplierProfileComponent,
  },
  {
    path: "supplier-profile",
    component: SupplierProfileComponent,
  },
  {
    path: "supplier-list/create-supplier",
    component: CreateSupplierComponent,
  },
  {
    path: "supplier-list/edit-supplier/:supplierId",
    component: EditSupplierComponent,
  },

  {
    path: "supplier-admins",
    component: SearchSupplierAdminsComponent,
  },
  {
    path: "supplier-admins/add-supplier-admin",
    component: AddSupplierAdminComponent,
  },
  {
    path: "supplier-admins/edit-supplier-admin/:accountId",
    component: EditSupplierAdminComponent,
  },

  {
    path: "supplier-team",
    component: SearchSupplierTeamComponent,
  },
  {
    path: "supplier-team/add-supplier-team-member",
    component: AddSupplierTeamMemberComponent,
  },
  {
    path: "supplier-team/edit-supplier-team-member/:accountId",
    component: EditSupplierTeamMemberComponent,
  },
  {
    path: "supplier-space",
    component: SupplierSpaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
