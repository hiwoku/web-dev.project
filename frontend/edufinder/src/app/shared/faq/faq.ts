import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})

export class FAQComponent {
  expanded = signal(false);

  faqs = signal<FAQItem[]>([
    {
      id: 1,
      question: 'What will I learn in these courses?',
      answer: 'You will build practical, job-ready skills through real lessons, guided examples, and hands-on course materials. Topics depend on the course, but most help you improve communication, business thinking, digital tools, and professional confidence.',
      open: false
    },
    {
      id: 2,
      question: 'How much do these courses cost?',
      answer: 'EduFinder includes both free and paid courses. Free courses can be joined instantly, while paid courses unlock after purchase and then remain available in your learning profile.',
      open: false
    },
    {
      id: 3,
      question: 'How will these courses help me in my career?',
      answer: 'These courses are designed to strengthen real-world skills that can support internships, academic growth, and future job opportunities. They help you learn faster, present yourself better, and gain knowledge valued by companies.',
      open: false
    },
    {
      id: 4,
      question: 'Is there any limit on how many times I can take a course?',
      answer: 'No. Once you are enrolled, you can return to the course content whenever you need, review lessons again, and learn at your own pace.',
      open: false
    },
    {
      id: 5,
      question: 'What skills will I gain from these courses?',
      answer: 'Depending on the course, you may gain skills in communication, teamwork, leadership, time management, marketing, project coordination, problem solving, and professional development.',
      open: false
    },
    {
      id: 6,
      question: 'Can I access courses on my own schedule?',
      answer: 'Yes. Courses are built for flexible learning, so you can study when it is convenient for you and move through materials at your own speed.',
      open: false
    },
    {
      id: 7,
      question: 'Will my enrolled courses appear in my profile?',
      answer: 'Yes. After enrolling in a free course or purchasing a paid one, the course appears in your profile under your learning section.',
      open: false
    },
    {
      id: 8,
      question: 'Can companies publish courses on EduFinder?',
      answer: 'Yes. Company accounts can create and publish courses, helping learners discover new programs and helping companies share their expertise.',
      open: false
    }
  ]);

  visibleFaqs = computed(() => {
    return this.expanded() ? this.faqs() : this.faqs().slice(0, 5);
  });

  toggleFaq(id: number): void {
    this.faqs.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, open: !item.open }
          : item
      )
    );
  }

  toggleExpanded(): void {
    this.expanded.update(value => !value);
  }

  hasMore(): boolean {
    return this.faqs().length > 5;
  }
}