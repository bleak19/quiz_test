import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-quiz',
  imports: [FormsModule, CommonModule],
  template: `
    <!-- Enter name -->
    <div class="name-container" *ngIf="!username">
      <div class="name-card">
        <h2>Enter Your Name</h2>
        <input 
          class="name-input" 
          [(ngModel)]="tempName" 
          placeholder="Enter your name" 
        />
        <button class="start-btn" (click)="start()">Start Test</button>
      </div>
    </div>

    <!-- Quiz -->
    <div class="quiz-container" *ngIf="username && test">
      <div class="quiz-header">
        <h1 class="quiz-title">{{ test.testName }}</h1>
        <div class="quiz-progress" *ngIf="test.questions?.length > 0">
          Progress: {{ getAnsweredCount() }}/{{ test.questions.length }} questions answered
        </div>
      </div>

      <div class="questions-container">
        <div class="question-card" *ngFor="let q of test.questions; let i = index">
          <div class="question-header">
            <span class="question-number">Question {{ i + 1 }}</span>
            <span class="question-status" *ngIf="answers[q.id]">✓ Answered</span>
          </div>
          
          <p class="question-text">{{ q.text }}</p>

          <div class="answers-list">
            <div 
              class="answer-option" 
              *ngFor="let a of q.answers"
              [class.selected]="answers[q.id] === a.id"
            >
              <label class="answer-label">
                <input
                  type="radio"
                  [name]="'q-' + q.id"
                  [value]="a.id"
                  [(ngModel)]="answers[q.id]"
                  (change)="onAnswerSelected()"
                />
                <span class="answer-text">{{ a.text }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-footer">
        <button class="submit-btn" (click)="submitQuiz()">Submit Quiz</button>
      </div>
    </div>

    <!-- Loading state -->
    <div class="loading-container" *ngIf="!test">
      <div class="spinner"></div>
      <p>Loading test...</p>
    </div>
  `,
  styles: [`
    /* Container Styles */
    .quiz-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    /* Name Container */
    .name-container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .name-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 100%;
    }

    .name-card h2 {
      color: #333;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }

    .name-input {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      margin-bottom: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }

    .name-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .start-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      width: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .start-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    /* Quiz Header */
    .quiz-header {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .quiz-title {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 2rem;
      font-weight: 700;
    }

    .quiz-progress {
      color: #666;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Questions Container */
    .questions-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Question Card */
    .question-card {
      background: white;
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .question-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    /* Question Header */
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #f0f0f0;
    }

    .question-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .question-status {
      color: #4caf50;
      font-size: 0.8rem;
      font-weight: 600;
    }

    /* Question Text */
    .question-text {
      font-size: 1.1rem;
      font-weight: 500;
      color: #333;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    /* Answers List */
    .answers-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .answer-option {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .answer-option:hover {
      background: #f1f3f5;
      border-color: #667eea;
    }

    .answer-option.selected {
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-color: #667eea;
    }

    /* Answer Label */
    .answer-label {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      cursor: pointer;
      margin: 0;
    }

    .answer-label input[type="radio"] {
      margin-right: 1rem;
      cursor: pointer;
      width: 18px;
      height: 18px;
      accent-color: #667eea;
    }

    .answer-text {
      font-size: 1rem;
      color: #555;
      cursor: pointer;
      flex: 1;
    }

    /* Quiz Footer */
    .quiz-footer {
      margin-top: 2rem;
      text-align: center;
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .submit-btn:active {
      transform: translateY(0);
    }

    /* Loading Container */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .loading-container p {
      color: white;
      font-size: 1.2rem;
      margin-top: 1rem;
    }

    /* Spinner Animation */
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .quiz-container {
        padding: 1rem;
      }

      .quiz-header {
        padding: 1rem;
      }

      .quiz-title {
        font-size: 1.5rem;
      }

      .question-card {
        padding: 1rem;
      }

      .question-text {
        font-size: 1rem;
      }

      .answer-label {
        padding: 0.5rem 0.75rem;
      }

      .answer-text {
        font-size: 0.9rem;
      }

      .submit-btn {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }
    }

    /* Print Styles */
    @media print {
      .quiz-container {
        background: white;
        padding: 0;
      }

      .submit-btn,
      .quiz-progress {
        display: none;
      }

      .question-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ddd;
      }
    }
  `],
})
export class Quiz implements OnInit {
  constructor(private route: ActivatedRoute, private api: Api, private cd: ChangeDetectorRef) {}

  test: any = null;
  tempName = '';
  username: string | null = null;

  answers: { [questionId: string]: string } = {};

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTest(id);
    }
  }

  start() {
    if (!this.tempName) return;
    this.username = this.tempName;
  }

  getAnsweredCount(): number {
    return Object.keys(this.answers).length;
  }

  onAnswerSelected() {
    console.log(`Answered ${this.getAnsweredCount()} of ${this.test?.questions?.length || 0} questions`);
  }

  submitQuiz() {
    const totalQuestions = this.test?.questions?.length || 0;
    const answeredCount = this.getAnsweredCount();
    
    if (answeredCount < totalQuestions) {
      alert(`Please answer all questions. You've answered ${answeredCount} out of ${totalQuestions}.`);
      return;
    }
    
    console.log('Quiz submitted with answers:', this.answers);
    alert('Quiz submitted successfully!');
  }

  loadTest(id: string) {
    console.log("Loading test with id:", id);

    this.api.getTest(id).subscribe({
      next: (res) => {
        console.log("TEST RESPONSE:", res);
        this.test = res;
        console.log("Answer IDs:", res.questions.map((q : any) => q.answers.map((a : any) => a.id)));
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Load test failed:", err);
        alert("Failed to load test");
      },
      complete: () => {
        console.log("Request completed");
      }
    });
  }
}