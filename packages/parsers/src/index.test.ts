import { describe, it, expect } from 'vitest';
import { parseReceipt, parseSharedContent } from './index';
import greenhouseSample from '../fixtures/greenhouse-sample.json';
import leverSample from '../fixtures/lever-sample.json';
import workdaySample from '../fixtures/workday-sample.json';
import genericSample from '../fixtures/generic-sample.json';

describe('parseReceipt', () => {
  it('should parse Greenhouse email', () => {
    const result = parseReceipt({
      content: greenhouseSample.content,
      subject: greenhouseSample.subject,
      sender: greenhouseSample.sender,
    });

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Senior Software Engineer');
    expect(result?.company).toBe('TechCorp Inc');
    expect(result?.location).toBe('San Francisco, CA');
    expect(result?.job_url).toContain('greenhouse.io');
    expect(result?.vendor).toBe('greenhouse');
    expect(result?.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('should parse Lever email', () => {
    const result = parseReceipt({
      content: leverSample.content,
      subject: leverSample.subject,
      sender: leverSample.sender,
    });

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Frontend Developer');
    expect(result?.company).toBe('StartupXYZ');
    expect(result?.job_url).toContain('lever.co');
    expect(result?.vendor).toBe('lever');
    expect(result?.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('should parse Workday email', () => {
    const result = parseReceipt({
      content: workdaySample.content,
      subject: workdaySample.subject,
      sender: workdaySample.sender,
    });

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Full Stack Engineer');
    expect(result?.company).toBe('BigTech Inc');
    expect(result?.location).toBe('New York, NY');
    expect(result?.job_url).toContain('workday');
    expect(result?.vendor).toBe('workday');
    expect(result?.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('should parse generic email with fallback', () => {
    const result = parseReceipt({
      content: genericSample.content,
      subject: genericSample.subject,
      sender: genericSample.sender,
    });

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Backend Engineer');
    expect(result?.company).toBe('SmallCompany');
    expect(result?.vendor).toBe('unknown');
    expect(result?.confidence).toBeLessThan(0.8);
  });

  it('should return null for completely unparseable email', () => {
    const result = parseReceipt({
      content: 'This is just a random email with no job information.',
      subject: 'Random Subject',
      sender: 'random@example.com',
    });

    // Fallback parser should return null if no job info found
    expect(result).toBeNull();
  });
});

describe('parseSharedContent', () => {
  it('should parse shared URL with title', () => {
    const result = parseSharedContent(
      'https://jobs.example.com/senior-engineer',
      'Senior Software Engineer at Example Corp',
      'Join our team...'
    );

    expect(result.title).toBe('Senior Software Engineer');
    expect(result.company).toBe('Example Corp');
    expect(result.job_url).toBe('https://jobs.example.com/senior-engineer');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should extract company from URL domain', () => {
    const result = parseSharedContent(
      'https://careers.techcorp.com/job/123',
      'Software Engineer'
    );

    expect(result.title).toBe('Software Engineer');
    expect(result.company).toBe('Techcorp');
    expect(result.job_url).toBe('https://careers.techcorp.com/job/123');
  });

  it('should handle minimal information', () => {
    const result = parseSharedContent(
      undefined,
      'Engineering Role',
      undefined
    );

    expect(result.title).toBe('Engineering Role');
    expect(result.company).toBe('Unknown Company');
  });
});

