import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({ // Formulario Reactivo
    id:               new FormControl(''), // Campos del formulario reactivo
    superhero:        new FormControl('', { nonNullable: true }), // Obligamos a que no sea nunca null
    publisher:        new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl(''),
    first_appearance: new FormControl(''),
    characters:       new FormControl(''),
    alt_img:          new FormControl('')
  });

  public publishers = [
    {id: 'DC Comics', value: 'DC - Comics'},
    {id: 'Marvel Comics', value: 'Marvel - Comics'}
  ]

  constructor (
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroService.getHeroById(id))
      )
      .subscribe ( hero => {
        if ( !hero ) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero); // Seteamos los valores del objeto hero al formulario

        return;
      });
  }

  onSubmit(): void {

    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroService.updateHero(this.currentHero)
        .subscribe( hero => {
          this.showSnackbar(`${hero.superhero} updated!`);
        });

      return;
    }

    this.heroService.addHero(this.currentHero)
      .subscribe( hero => {
        this.showSnackbar(`${hero.superhero} created!`);
        this.router.navigate(['/heroes/edit/', hero.id])
      })
  }

  onDeleteHero(): void {
    if ( !this.currentHero.id ) throw new Error('Hero ID is required!');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) return;

      this.heroService.deleteHeroById(result)
        .subscribe( result => {
          this.showSnackbar(`${this.currentHero.superhero} deleted!`);
          this.router.navigateByUrl('/heroes');
        });
    });
  }

  showSnackbar( message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500
    });
  }

}
