import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from '../../service/auth.service';
import { el } from '@fullcalendar/core/internal-common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-companyhead',
    templateUrl: './companyhead.component.html',
    styleUrl: './companyhead.component.scss',
})
export class CompanyheadComponent implements OnInit {
    customers1: Customer[] = [];
    representatives: Representative[] = [];
    loading: boolean = false;
    display: boolean = false;
    users: any[];
    @Input() profileImageUrl: string;
    @Input() imageSize: number = 100; // default size
    @Input() companyName: string;
    @Input() otherDetail: string;
    showUploadButton = false;
    imageUrl: string | ArrayBuffer;
    private apiUrl = 'http://localhost:3000/api';

    constructor(private authService: AuthService, private http: HttpClient) {}

    ngOnInit(): void {
        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'XuXue Feng', image: 'xuxuefeng.png' },
        ];
        this.loadUsers();
        this.getProfilePicture();
    }

    onUpload(event: any) {
        const file = event.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.profileImageUrl = reader.result as string;
        };
    }

    loadUsers(): void {
        this.authService.getUsers().subscribe(
            (data) => {
                this.users = data;
            },
            (error) => {
                console.error('Error loading users:', error);
            }
        );
    }

    addUser(name: string, email: string): void {
        this.authService.addUser(name, email).subscribe(
            (response) => {
                console.log('User added successfully:', response);
                this.loadUsers(); // Reload users after adding
            },
            (error) => {
                console.error('Error adding user:', error);
            }
        );
    }

    updateUser(id: number, name: string, email: string): void {
        this.authService.updateUser(id, name, email).subscribe(
            (response) => {
                console.log('User updated successfully:', response);
                this.loadUsers(); // Reload users after updating
            },
            (error) => {
                console.error('Error updating user:', error);
            }
        );
    }

    deleteUser(id: number): void {
        this.authService.deleteUser(id).subscribe(
            (response) => {
                console.log('User deleted successfully:', response);
                this.loadUsers(); // Reload users after deleting
            },
            (error) => {
                console.error('Error deleting user:', error);
            }
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    showNewProfileDialog() {
        if (this.display) this.display = false;
        else this.display = true;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imageUrl = reader.result;
            };
            reader.readAsDataURL(file);

            this.uploadFile(file);
        }
    }

    // uploadFile(file: File) {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     this.http.post<any>(`${this.apiUrl}/upload`, formData).subscribe(
    //         (response) => {
    //             console.log('Upload successful', response);
    //         },
    //         (error) => {
    //             console.error('Upload error', error);
    //         }
    //     );
  // }
  
  uploadFile(file: File) {
    this.authService.uploadFile(file).subscribe(
      response => {
        this.imageUrl = `../src/assets/demo/uploads/${response.filePath}`;
      },
      error => {
        console.error('Upload error', error);
        alert('File upload failed');
      }
    );
  }
  getProfilePicture() {
    this.authService.getProfilePicture().subscribe(
      response => {
        if (response.filePath) {
          this.imageUrl = `src/assets/demo/uploads/${response.filePath}`;          
          console.log("Image: "+this.imageUrl);
        }
      },
      error => {
        console.error('Error fetching profile picture', error);
      }
    );
  }
}
