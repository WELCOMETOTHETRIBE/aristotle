import { LyceumUserProgress, LyceumPathProgress, LyceumActivityResponse, LyceumEvaluation } from '@prisma/client';
import { LyceumData } from './lyceum-data';

export interface CertificateRequirements {
  completedPaths: number;
  requiredPaths: number;
  averageMastery: number;
  requiredMastery: number;
  totalArtifacts: number;
  requiredArtifacts: number;
  masteryDomains: {
    theoretical: number;
    practical: number;
    reflective: number;
    creative: number;
  };
  requiredMasteryPerDomain: number;
}

export interface CertificateData {
  userId: string;
  userName: string;
  completionDate: Date;
  overallMastery: number;
  masteryBreakdown: {
    theoretical: number;
    practical: number;
    reflective: number;
    creative: number;
  };
  pathCompletions: string[];
  totalArtifacts: number;
  certificateId: string;
  verificationCode: string;
}

export class LyceumCertificate {
  private static readonly REQUIRED_PATHS = 12;
  private static readonly REQUIRED_MASTERY = 3.5;
  private static readonly REQUIRED_ARTIFACTS = 20;
  private static readonly REQUIRED_MASTERY_PER_DOMAIN = 3.0;

  static checkEligibility(
    userProgress: LyceumUserProgress,
    pathProgress: LyceumPathProgress[],
    artifacts: (LyceumActivityResponse | LyceumEvaluation)[]
  ): { eligible: boolean; requirements: CertificateRequirements } {
    const completedPaths = pathProgress.filter(p => p.completedLessons >= 3).length;
    const totalArtifacts = artifacts.length;
    
    const masteryDomains = {
      theoretical: userProgress.masteryTheoretical || 0,
      practical: userProgress.masteryPractical || 0,
      reflective: userProgress.masteryReflective || 0,
      creative: userProgress.masteryCreative || 0
    };

    const averageMastery = Object.values(masteryDomains).reduce((sum, score) => sum + score, 0) / 4;

    const requirements: CertificateRequirements = {
      completedPaths,
      requiredPaths: this.REQUIRED_PATHS,
      averageMastery,
      requiredMastery: this.REQUIRED_MASTERY,
      totalArtifacts,
      requiredArtifacts: this.REQUIRED_ARTIFACTS,
      masteryDomains,
      requiredMasteryPerDomain: this.REQUIRED_MASTERY_PER_DOMAIN
    };

    const eligible = 
      completedPaths >= this.REQUIRED_PATHS &&
      averageMastery >= this.REQUIRED_MASTERY &&
      totalArtifacts >= this.REQUIRED_ARTIFACTS &&
      Object.values(masteryDomains).every(score => score >= this.REQUIRED_MASTERY_PER_DOMAIN);

    return { eligible, requirements };
  }

  static generateCertificate(
    userProgress: LyceumUserProgress,
    pathProgress: LyceumPathProgress[],
    artifacts: (LyceumActivityResponse | LyceumEvaluation)[],
    userName: string,
    lyceumData: LyceumData
  ): CertificateData {
    const { eligible, requirements } = this.checkEligibility(userProgress, pathProgress, artifacts);
    
    if (!eligible) {
      throw new Error('User is not eligible for certificate');
    }

    const completedPaths = pathProgress
      .filter(p => p.completedLessons >= 3)
      .map(p => {
        const path = lyceumData.paths.find(path => path.id === p.pathId);
        return path?.title || 'Unknown Path';
      });

    const certificateId = this.generateCertificateId();
    const verificationCode = this.generateVerificationCode();

    return {
      userId: userProgress.userId,
      userName,
      completionDate: new Date(),
      overallMastery: requirements.averageMastery,
      masteryBreakdown: requirements.masteryDomains,
      pathCompletions: completedPaths,
      totalArtifacts: requirements.totalArtifacts,
      certificateId,
      verificationCode
    };
  }

  static generateCertificateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `LYC-${timestamp}-${random}`.toUpperCase();
  }

  static generateVerificationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static calculateMasteryScore(
    artifacts: (LyceumActivityResponse | LyceumEvaluation)[],
    domain: 'theoretical' | 'practical' | 'reflective' | 'creative'
  ): number {
    const domainArtifacts = artifacts.filter(artifact => {
      if ('masteryDomain' in artifact) {
        return artifact.masteryDomain === domain;
      }
      return false;
    });

    if (domainArtifacts.length === 0) return 0;

    const totalScore = domainArtifacts.reduce((sum, artifact) => {
      if ('score' in artifact && artifact.score !== null) {
        return sum + artifact.score;
      }
      return sum;
    }, 0);

    return totalScore / domainArtifacts.length;
  }

  static updateMasteryScores(
    userProgress: LyceumUserProgress,
    artifacts: (LyceumActivityResponse | LyceumEvaluation)[]
  ): Partial<LyceumUserProgress> {
    return {
      masteryTheoretical: this.calculateMasteryScore(artifacts, 'theoretical'),
      masteryPractical: this.calculateMasteryScore(artifacts, 'practical'),
      masteryReflective: this.calculateMasteryScore(artifacts, 'reflective'),
      masteryCreative: this.calculateMasteryScore(artifacts, 'creative')
    };
  }

  static getCertificateProgress(
    userProgress: LyceumUserProgress,
    pathProgress: LyceumPathProgress[],
    artifacts: (LyceumActivityResponse | LyceumEvaluation)[]
  ): {
    overallProgress: number;
    pathProgress: number;
    masteryProgress: number;
    artifactProgress: number;
    domainProgress: { [key: string]: number };
  } {
    const { requirements } = this.checkEligibility(userProgress, pathProgress, artifacts);
    
    const pathProgressPercent = (requirements.completedPaths / requirements.requiredPaths) * 100;
    const masteryProgressPercent = (requirements.averageMastery / requirements.requiredMastery) * 100;
    const artifactProgressPercent = (requirements.totalArtifacts / requirements.requiredArtifacts) * 100;
    
    const domainProgress = {
      theoretical: (requirements.masteryDomains.theoretical / requirements.requiredMasteryPerDomain) * 100,
      practical: (requirements.masteryDomains.practical / requirements.requiredMasteryPerDomain) * 100,
      reflective: (requirements.masteryDomains.reflective / requirements.requiredMasteryPerDomain) * 100,
      creative: (requirements.masteryDomains.creative / requirements.requiredMasteryPerDomain) * 100
    };

    const overallProgress = (pathProgressPercent + masteryProgressPercent + artifactProgressPercent) / 3;

    return {
      overallProgress,
      pathProgress: pathProgressPercent,
      masteryProgress: masteryProgressPercent,
      artifactProgress: artifactProgressPercent,
      domainProgress
    };
  }

  static formatCertificateData(certificateData: CertificateData): string {
    return JSON.stringify({
      certificateId: certificateData.certificateId,
      userName: certificateData.userName,
      completionDate: certificateData.completionDate.toISOString(),
      overallMastery: certificateData.overallMastery,
      masteryBreakdown: certificateData.masteryBreakdown,
      pathCompletions: certificateData.pathCompletions,
      totalArtifacts: certificateData.totalArtifacts,
      verificationCode: certificateData.verificationCode
    }, null, 2);
  }

  static verifyCertificate(certificateData: string, verificationCode: string): boolean {
    try {
      const data = JSON.parse(certificateData);
      return data.verificationCode === verificationCode;
    } catch {
      return false;
    }
  }
}
