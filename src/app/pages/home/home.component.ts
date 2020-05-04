import { Component , OnInit , OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService, AlertService , ProjectService  ,AgentService} from '../../shared';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styles: [`
  button {
    position: fixed;
    bottom: 70px;
    float: right;
    right: 10px;
    z-index: 10;
  }`]
})

export class HomeComponent implements OnInit , OnDestroy {

  featuredCarousel: OwlOptions = {
    loop: true,
    margin: -1,
    items: 1,
    nav: true,
    navText: ['<i class="ion-ios-arrow-back" aria-hidden="true"></i>', '<i class="ion-ios-arrow-forward" aria-hidden="true"></i>'],
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true
  };

  propertyCarousel: OwlOptions = {
    loop: true,
    margin: 30,
    responsive: {
      0: {
        items: 1,
      },
      769: {
        items: 2,
      },
      992: {
        items: 3,
      }
    }
  };

  agentCarousel: OwlOptions = {
    loop: true,
    margin: 30,
    responsive: {
      0: {
        items: 1,
      },
      769: {
        items: 2,
      },
      992: {
        items: 3,
      }
    }
  };

  public isAuthenticated: string;
  featuredSub: Subscription;
  featured: any;
  agentSub : Subscription;
  agents;

  constructor(
    public authService: AuthService,
    private alertService: AlertService,
    public projectService: ProjectService,
    public agentService: AgentService
    ) {
      this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.featuredSub = this.projectService.getFeaturedProjects().subscribe( res => {
      this.featured = res;
    });
    this.getAgents();
  }

  getAgents() {
    this.agentSub = this.agentService.getWithPosition('Agent').subscribe( results =>  {
      this.agents = results;
    });
  }

  public onToTop(): void {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  ngOnDestroy() {

    if (this.featuredSub != null) {
      this.featuredSub.unsubscribe();
    }

    if (this.agentSub != null) {
      this.agentSub.unsubscribe();
    }
  }

}
