import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth'
import { Api } from '../services/api'
import { Answer, Category, NewQuestion, TestForUser, TestPreview, SaveTestRequest} from "../DTOs/DTOs"


@Component({
  standalone: true,
  selector: 'app-admin-panel',
  imports: [FormsModule, CommonModule],
  template: `
<div class="admin-wrapper">


  <div class="top-bar">
    <div class="spacer"></div>
    <div class="user-section">
      <span class="email">{{ userEmail }}</span>
      <button class="logout-btn" (click)="logout()">Logout</button>
    </div>
  </div>

  <div class="content">

  <div style="display: flex; gap: 10px; margin-bottom: 20px;">
  <button (click)="view = 'test'">Create Test</button>
  <button (click)="view = 'question'">Add Question</button>
  <button (click)="openPreview()">Test Preview</button>
  <button (click)="view = 'previousTests'">Previous Tests</button>
</div>

<div *ngIf="view === 'test'">
  <h2>Create New Test</h2>

  <div class="form">

      <select [(ngModel)]="testTheme">
        <option value="category">Choose Existing Category</option>
        <option value="custom">Custom Test</option>
      </select>

      <div *ngIf="testTheme === 'category'">
        <select [(ngModel)]="testCategoryId">
          <option [ngValue]="null">-- Select Category --</option>
          <option *ngFor="let cat of allCategories" [ngValue]="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <button (click)="generateTest()" style="margin-top: 10px;" >Generate Test</button>
      </div>

      <div *ngIf="testTheme === 'custom'">
        <input [(ngModel)]="customTestName" placeholder="Test Name" />
        <button (click)="createCustomTest()" style="margin-top: 10px;" >Create Test</button>
      </div>

  </div>
</div>

<div *ngIf="view === 'question'">
   <h2>Add New Question</h2>
    <div class="form">

     <input [(ngModel)]="questionText" placeholder="Question" />

<div *ngFor="let answer of answers; let i = index" class="answer-row">
  <label>
    <input type="checkbox" [(ngModel)]="answer.isCorrect" />
    Correct
  </label>

  <input [(ngModel)]="answer.text" placeholder="Answer {{ i + 1 }}" />

  <button (click)="removeAnswer(i)">Remove</button>
</div>

<button (click)="addAnswer()">Add More Answers</button>

      <h4>Category</h4>

      <select [(ngModel)]="questionCategoryId">
        <option [ngValue]="null">-- Select Category --</option>
        <option *ngFor="let cat of allCategories" [ngValue]="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <button (click)="showCategoryForm = true">
        + Add Category
      </button>

      <div *ngIf="showCategoryForm" class="form">
        <input [(ngModel)]="newCategoryName" placeholder="New category name" />

        <button (click)="addCategory()">Save</button>
        <button (click)="cancelCategory()">Cancel</button>
      </div>

      <button class="add-btn" (click)="addQuestion()">
        Add Question
      </button>

    </div>
</div>

<div *ngIf="view === 'testPreview'">

  <div class="form" *ngIf="previewTest; else noTest">

  <div class="test-header">
    <h3>{{ previewTest.testName }}</h3>
    <div class="time">⏱ {{ testDuration }} min</div>
  </div>

  <div class="test-settings">
    <input
      [(ngModel)]="customTestName"
      placeholder="Test name"
    />

   <div class="time-input">
  <input
    type="number"
    [(ngModel)]="testDuration"
    placeholder="Time limit"
  />
  <span>minutes</span>
</div>


  </div>


    <div *ngFor="let q of previewTest.questions; let i = index" class="question-block">

      <div class="question-text">
        {{ i + 1 }}. {{ q.text }}
      </div>

      <div class="answers">
        <div *ngFor="let a of q.answers" class="answer">
          <input type="checkbox" [checked]="a.isCorrect" disabled />
          <span [class.correct]="a.isCorrect">
            {{ a.text }}
          </span>
        </div>
      </div>

    </div>

     <button (click)="saveTest()" class="save-btn">
      Save Test
    </button>

  </div>

  <ng-template #noTest>
    <div class="form">
      No test loaded. Generate or select a test first.
    </div>
  </ng-template>
</div>

</div>

<div *ngIf="view === 'previousTests'">
  <h2>Previous tests</h2>

  <div class="form">
    There are no previous tests
  </div>
</div>

</div>
  `,

  styles: `
  
  .admin-wrapper {
  font-family: Arial, sans-serif;
  background: #f3f4f6;
  min-height: 100vh;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.test-settings {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}


.save-btn {
  background: #4f46e5;   /* nice blue-purple */
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: 0.2s;
}

.save-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}


.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
  background: #111827;
  color: white;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logout-btn {
  background: #ef4444;
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background: #dc2626;
}

.content {
  max-width: 700px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input, select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

input:focus, select:focus {
  outline: none;
  border-color: #6366f1;
}

button {
  width: fit-content;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.add-btn {
  background: #4f46e5;
  color: white;
}

.add-btn:hover {
  background: #4338ca;
}

/* Secondary */
.primary-btn {
  background: #4f46e5;
  color: white;
}

.secondary-btn {
  background: #e5e7eb;
}


.answer-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.answer-row input[type="text"] {
  flex: 1;
}

label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

h2 {
  margin-bottom: 5px;
  color: #111827;
}
.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 14px;
  color: #6b7280;
}

.question-block {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

.question-text {
  font-weight: 600;
  margin-bottom: 10px;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.answer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.correct {
  color: #16a34a;
  font-weight: 500;
}

input[type="checkbox"] {
  width: auto;
}

.time-input {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* IMPORTANT: override global 100% width */
.time-input input {
  width: 80px;   /* or 100px */
}


  `
})
export class AdminPanel implements OnInit {

  constructor(
    private router: Router,
    private auth: Auth,
    private api: Api,
    private cd: ChangeDetectorRef
  ) { }

  //properties

  userEmail = '';
  view: 'test' | 'question' | 'testPreview' | 'previousTests' = 'test';
  testCategoryId: number | null = null;
  questionCategoryId: number | null = null;
  showCategoryForm = false;
  newCategoryName = '';
  questionText = '';
  answers: Answer[] = [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }];
  testTheme: 'category' | 'custom' = 'category';
  allCategories: Category[] = [];
  customTestName = '';
  previewTest: TestPreview | null = null;
  selectedQuestionIds: number[] = [];
  testDuration : number = 30;



  ngOnInit() {
    this.auth.user().subscribe(res => {
      this.userEmail = res.email;
      this.cd.detectChanges();
    });

    this.loadCategories();
  }

  loadCategories() {
    this.api.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories = res,
        this.cd.detectChanges();
      },
      error: () => alert('Failed to load categories')
    });
  }

  generateTest() {
    if (!this.testCategoryId) {
      alert('Select a category');
      return;
    }

    console.log('Generate test:', this.testCategoryId);
    this.openPreview();
  }

  createCustomTest() {
    if (!this.customTestName.trim()) {
      alert('Enter test name');
      return;
    }

    console.log('Custom test:', this.customTestName);
  }

  addAnswer() {
    this.answers.push({ text: '', isCorrect: false });
  }


  removeAnswer(i: number) {
    if (this.answers.length > 1) {
      this.answers.splice(i, 1);
    }
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  addQuestion() {
    if (!this.questionText.trim()) {
      alert('Enter question');
      return;
    }

    if (!this.questionCategoryId) {
      alert('Select category');
      return;
    }

    if (this.answers.some(a => !a.text.trim())) {
      alert('All answers must have text');
      return;
    }

    if (!this.answers.some(a => a.isCorrect)) {
      alert('Select at least one correct answer');
      return;
    }

    const question: NewQuestion = {
      categoryId: this.questionCategoryId,
      text: this.questionText,
      answers: this.answers
    };

    this.api.addQuestion(question).subscribe({
      next: () => {
        alert('Question added');
        this.resetForm();
      },
      error: () => alert('Error adding question')
    });
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    this.api.postCategory({ name: this.newCategoryName }).subscribe({
      next: (cat: Category) => {
        this.allCategories.push(cat);
        this.questionCategoryId = cat.id;

        this.newCategoryName = '';
        this.showCategoryForm = false;
      }
    });
  }

  cancelCategory() {
    this.showCategoryForm = false;
    this.newCategoryName = '';
  }

  resetForm() {
    this.questionText = '';
    this.answers = [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ];
    this.questionCategoryId = null;
    this.cd.detectChanges();
  }

  loadTestPreview() {
    if (this.testCategoryId == null) {
      alert("Choose Test Category First");
      return; // or show error
    }
    this.api.getTestPreview(this.testCategoryId).subscribe({
      next: (res) => {
        this.previewTest = res;
        this.cd.detectChanges();
      },
      error: () => alert('Failed to load test')
    });
  }

  openPreview() {
    this.view = 'testPreview';
    this.loadTestPreview();
  }

  saveTest() {
  if (!this.testCategoryId) {
    alert("Select category");
    return;
  }

  if (!this.customTestName.trim()) {
    alert("Enter test name");
    return;
  }

  this.selectedQuestionIds = this.previewTest?.questions.map(q => q.id) ?? [];


  if (this.selectedQuestionIds.length === 0) {
    alert("Select questions");
    return;
  }

  const request: SaveTestRequest = {
    categoryId: this.testCategoryId,
    testName: this.customTestName,
    duration: this.testDuration, 
    questionIds: this.selectedQuestionIds
  };

  this.api.saveTest(request).subscribe({
    next: (testId: string) => {
      const link = `${window.location.origin}/test/${testId}`;
      prompt("Copy your link:", link);

    },
    error: () => alert("Failed to save test")
  });
}

}
