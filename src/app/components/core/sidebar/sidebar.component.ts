import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PendingSaveService } from "src/app/services/core/pending-save.service";
import { AuthService } from "src/app/services/identity/auth.service";
import { VenueHandlerService } from "src/app/services/identity/venue-handler.service";
import Roles from "src/app/types/roles";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.less"],
})
export class SidebarComponent implements OnInit {
  public venueName: string = "";
  expandedItem = null;

  public venueAdminItems = [
    {
      icon: "fa fa-th-large",
      title: "Dashboard",
      link: "/dashboard/demo",

      // children: [
      //   {
      //     icon: "fa fa-tachometer",
      //     title: "Demo",
      //     link: "/dashboard/home",
      //   },

      //   {
      //     icon: "fa fa-link",
      //     title: "Outgoings",
      //     link: "/dashboard/outgoing",
      //   },        
        
      //   {
      //     icon: "fa fa-truck",
      //     title: "Products",
      //     link: "/dashboard/products",
      //   },
        
      // ],
      children: null,
      isExpanded: false,
    },
    {
      icon: "fa fa-dollar",
      title: "Sales",
      link: "/dashboard/sales",
      children: null,
      isExpanded: false,
    },
    {
      icon: "fa fa-truck",
      title: "Overheads",
      link: "/over-heads",
      children: null,
      isExpanded: false,
    },
    {
      icon: "fa fa-truck",
      title: "Spec Sheet",
      link: "/spec-sheet",
      // link: "/supplier-space",
      children: null,
      isExpanded: false,
    },
    {
      icon: "fa fa-truck",
      title: "Margin Tracker",
      link: "/dashboard/margin-tracker",
      children: null,
      isExpanded: false,
    },
   
    {
      icon: "fa fa-tachometer",
      title: " Venue",
      link: "/venue-profile",
      children: null,
      isExpanded: false,
    },

    {
      icon: "fa fa-comment",
      title: "Posts",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "Search Posts",
          link: "/venue-posts",
        },
        {
          icon: "fa fa-plus",
          title: "Create Post",
          link: "/venue-posts/create-post",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-users",
      title: "Team",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Team",
          link: "/venue-team",
        },
        {
          icon: "fa fa-plus",
          title: "Add Team Member",
          link: "/venue-team/add-venue-team-member",
        },
      ],
      isExpanded: false,
    },
    
    // {
    //   icon: "fa fa-calculator",
    //   title: "Spec Sheet",
    //   link: "/dashboard/gp-calculator",
    //   children: null,
    //   isExpanded: false,
    // },
   

    {
      icon: "fa fa-exclamation-circle",
      title: "Support",
      link: "/support-tickets/create-ticket",
      children: null,
      isExpanded: false,
      class:"end"
    },
   
  ];

  public influencerAdminItems = [
    {
      icon: "fa fa-tachometer",
      title: "My Influencer Profile",
      link: "/influencer-profile",

      children: null,
      isExpanded: false,
    },

    {
      icon: "fa fa-send",
      title: "Posts",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "Search Posts",
          link: "/influencer-posts",
        },
        {
          icon: "fa fa-plus",
          title: "Create Post",
          link: "/influencer-posts/create-post",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-user",
      title: "Team",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Team",
          link: "/influencer-team",
        },
        {
          icon: "fa fa-plus",
          title: "Add Team Member",
          link: "/influencer-team/add-influencer-team-member",
        },
      ],
      isExpanded: false,
    },

    // {
    //   icon: 'fa fa-truck',
    //   title: 'Suppliers',
    //   link: '/supplier-space',
    //   children: null,
    //   isExpanded: false
    // },

    {
      icon: "fa fa-exclamation-circle",
      title: "Support",
      link: "/support-tickets/create-ticket",
      children: null,
      isExpanded: false,
    },
  ];

  public supplierAdminItems = [
    {
      icon: "fa fa-tachometer",
      title: "My Supplier",
      link: "/supplier-profile",

      children: null,
      isExpanded: false,
    },

    {
      icon: "fa fa-user",
      title: "Team",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Team",
          link: "/supplier-team",
        },
        {
          icon: "fa fa-plus",
          title: "Add Team Member",
          link: "/supplier-team/add-supplier-team-member",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-exclamation-circle",
      title: "Support",
      link: "/support-tickets/create-ticket",
      children: null,
      isExpanded: false,
    },

    {
      icon: "fa fa-truck",
      title: "All Suppliers",
      link: "/supplier-space",
      children: null,
      isExpanded: false,
    },
  ];

  public flootItems = [
    {
      icon: "fa fa-user",
      title: "Users",
      link: "/users",

      children: null,
      isExpanded: false,
    },

    {
      icon: "fa fa-building",
      title: "Venues",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "Search Venues",
          link: "/venues",
        },
        {
          icon: "fa fa-plus",
          title: "Add Venue",
          link: "/venues/create-venue",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-building",
      title: "Influencers",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "Search Influencers",
          link: "/influencers",
        },
        {
          icon: "fa fa-plus",
          title: "Add Influencer",
          link: "/influencers/create-influencer",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-send",
      title: "Posts",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "Search Venue Posts",
          link: "/posts/venue",
        },
        {
          icon: "fa fa-plus",
          title: "Create Venue Post",
          link: "/posts/venue/create-post",
        },
        {
          icon: "fa fa-eye",
          title: "Search Influencer Posts",
          link: "/posts/influencer",
        },
        {
          icon: "fa fa-plus",
          title: "Create Influencer Post",
          link: "/posts/influencer/create-post",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-building",
      title: "Suppliers",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Suppliers",
          link: "/supplier-list",
        },
        {
          icon: "fa fa-plus",
          title: "Add Supplier",
          link: "/supplier-list/create-supplier",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-exclamation-circle",
      title: "Reported Activity",
      link: "/reported-activity",
      children: null,
      isExpanded: false,
    },

    {
      icon: "fa fa-exclamation-circle",
      title: "Support Tickets",
      link: "/support-tickets",
      children: [
        {
          icon: "fa fa-eye",
          title: "Search Support Tickets",
          link: "/support-tickets",
        },
        {
          icon: "fa fa-plus",
          title: "Create Ticket",
          link: "/support-tickets/create-ticket",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-tag",
      title: "Tags",
      link: "/tags",
      children: null,
      isExpanded: false,
    },

    {
      icon: "fa fa-search",
      title: "Recommended Search",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Searches",
          link: "/recommended-searches",
        },
        {
          icon: "fa fa-plus",
          title: "Create Search",
          link: "/recommended-searches/create-recommended-search",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-bell",
      title: "Notifications",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Notifications",
          link: "/notifications",
        },
        {
          icon: "fa fa-send",
          title: "Send",
          link: "/notifications/send-notification",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-user",
      title: "Floot Team",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Team",
          link: "/floot-team",
        },
        {
          icon: "fa fa-plus",
          title: "Add Team Member",
          link: "/floot-team/add-team-member",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-user",
      title: "Venue Admins",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Venue Admins",
          link: "/venue-admins",
        },
        {
          icon: "fa fa-plus",
          title: "Add Venue Admin",
          link: "/venue-admins/add-venue-admin",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-user",
      title: "Supplier Admins",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Supplier Admins",
          link: "/supplier-admins",
        },
        {
          icon: "fa fa-plus",
          title: "Add Supplier Admin",
          link: "/supplier-admins/add-supplier-admin",
        },
      ],
      isExpanded: false,
    },

    {
      icon: "fa fa-file-text",
      title: "Policies",
      link: null,
      children: [
        {
          icon: "fa fa-eye",
          title: "View Privacy Policy",
          link: "/policies/privacy-policy",
        },
        {
          icon: "fa fa-eye",
          title: "View Terms & Conditions",
          link: "/policies/terms-and-conditions",
        },
      ],
      isExpanded: false,
    },
  ];

  public items = [];

  constructor(
    private pendingSaveService: PendingSaveService,
    private authService: AuthService,
    private venueHanler: VenueHandlerService
  ) {
    if (this.authService.account) {
      if (this.authService.account.role === Roles.FlootAdmin) {
        this.items = this.flootItems;
      } else if (this.authService.account.role === Roles.VenueAdmin) {
        this.items = this.venueAdminItems;
      } else if (this.authService.account.role === Roles.InfluencerAdmin) {
        this.items = this.influencerAdminItems;
      } else if (this.authService.account.role === Roles.SupplierAdmin) {
        this.items = this.supplierAdminItems;
      }
    } else {
      if (this.authService.getAuthenticationState().role === Roles.FlootAdmin) {
        this.items = this.flootItems;
      } else if (
        this.authService.getAuthenticationState().role === Roles.VenueAdmin
      ) {
        this.items = this.venueAdminItems;
      } else if (
        this.authService.getAuthenticationState().role === Roles.InfluencerAdmin
      ) {
        this.items = this.influencerAdminItems;
      } else if (
        this.authService.getAuthenticationState().role === Roles.SupplierAdmin
      ) {
        this.items = this.supplierAdminItems;
      }
    }
  }

  /**
   *
   *
   * @param {*} routerLink
   * @memberof SidebarComponent
   */
  public async navigateToRouterLink(routerLinkStack: any) {
    try {
      this.pendingSaveService.navigateSafely(routerLinkStack);
    } catch (error) {
      throw error;
    }
  }

  toggleMenu(itemName: string, link: string){
    if(this.expandedItem === itemName){
      this.expandedItem = null;
    } else{      
     this.expandedItem = itemName;
    }
    if(link){
      this.navigateToRouterLink([link]);
    }

  }

  ngOnInit(): void {}
}
