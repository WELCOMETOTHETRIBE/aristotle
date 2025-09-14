'use client';

import React, { useState, useEffect } from 'react';
import { useLyceum } from '@/lib/lyceum-context';
import { CertificateRequirements, CertificateData } from '@/lib/lyceum-certificate';

interface LyceumCertificateProps {
  onCertificateGenerated?: (certificate: CertificateData) => void;
}

export default function LyceumCertificate({ onCertificateGenerated }: LyceumCertificateProps) {
  const { userProgress, lyceumData } = useLyceum();
  const [requirements, setRequirements] = useState<CertificateRequirements | null>(null);
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  useEffect(() => {
    checkEligibility();
  }, [userProgress]);

  const checkEligibility = async () => {
    try {
      const response = await fetch('/api/lyceum/certificate');
      const data = await response.json();
      
      if (data.success) {
        setRequirements(data.requirements);
        setEligible(data.eligible);
        setCertificate(data.certificate);
      }
    } catch (error) {
      console.error('Error checking certificate eligibility:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/lyceum/certificate', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setCertificate(data.certificate);
        onCertificateGenerated?.(data.certificate);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Checking certificate eligibility...
        </div>
      </div>
    );
  }

  if (!requirements) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Unable to load certificate requirements
        </div>
      </div>
    );
  }

  const getProgressColor = (current: number, required: number) => {
    const percentage = (current / required) * 100;
    if (percentage >= 100) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (current: number, required: number) => {
    const percentage = (current / required) * 100;
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 75) return 'bg-yellow-600';
    if (percentage >= 50) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lyceum Certificate</h1>
        <p className="text-gray-600">
          Complete your journey through Aristotle's wisdom to earn your certificate
        </p>
      </div>

      {certificate ? (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Earned!</h2>
            <p className="text-gray-600 mb-4">
              Congratulations on completing your Lyceum journey
            </p>
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Certificate ID:</span>
                  <span className="ml-2 font-mono">{certificate.certificateId}</span>
                </div>
                <div>
                  <span className="font-semibold">Completion Date:</span>
                  <span className="ml-2">
                    {new Date(certificate.completionDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Overall Mastery:</span>
                  <span className="ml-2">{certificate.overallMastery.toFixed(1)}/5</span>
                </div>
                <div>
                  <span className="font-semibold">Total Artifacts:</span>
                  <span className="ml-2">{certificate.totalArtifacts}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const certificateText = JSON.stringify(certificate, null, 2);
                navigator.clipboard.writeText(certificateText);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy Certificate Data
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Certificate Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Paths Completed */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Paths Completed</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getProgressColor(requirements.completedPaths, requirements.requiredPaths)
                }`}>
                  {requirements.completedPaths}/{requirements.requiredPaths}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(requirements.completedPaths, requirements.requiredPaths)}`}
                  style={{ width: `${Math.min((requirements.completedPaths / requirements.requiredPaths) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Average Mastery */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Average Mastery</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getProgressColor(requirements.averageMastery, requirements.requiredMastery)
                }`}>
                  {requirements.averageMastery.toFixed(1)}/{requirements.requiredMastery}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(requirements.averageMastery, requirements.requiredMastery)}`}
                  style={{ width: `${Math.min((requirements.averageMastery / requirements.requiredMastery) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Total Artifacts */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Total Artifacts</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getProgressColor(requirements.totalArtifacts, requirements.requiredArtifacts)
                }`}>
                  {requirements.totalArtifacts}/{requirements.requiredArtifacts}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(requirements.totalArtifacts, requirements.requiredArtifacts)}`}
                  style={{ width: `${Math.min((requirements.totalArtifacts / requirements.requiredArtifacts) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mastery Domains */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mastery Domains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(requirements.masteryDomains).map(([domain, score]) => (
            <div key={domain} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {domain}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getProgressColor(score, requirements.requiredMasteryPerDomain)
                }`}>
                  {score.toFixed(1)}/{requirements.requiredMasteryPerDomain}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(score, requirements.requiredMasteryPerDomain)}`}
                  style={{ width: `${Math.min((score / requirements.requiredMasteryPerDomain) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Certificate Button */}
      {eligible && !certificate && (
        <div className="text-center">
          <button
            onClick={generateCertificate}
            disabled={generating}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating Certificate...' : 'Generate Certificate'}
          </button>
        </div>
      )}

      {!eligible && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">Not yet eligible</div>
          <p className="text-gray-400">
            Complete all requirements to earn your certificate
          </p>
        </div>
      )}
    </div>
  );
}