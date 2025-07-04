import { Injectable } from '@angular/core';

export interface FieldMatch {
  sourceField: string;
  suggestedField: string;
  confidence: number;
  distance: number;
}

@Injectable({
  providedIn: 'root'
})
export class LevenshteinService {

  /**
   * Calculate Levenshtein distance between two strings
   */
  calculateDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Find the best match for a source field among target fields
   */
  findBestMatch(sourceField: string, targetFields: string[]): FieldMatch {
    if (!sourceField || !Array.isArray(targetFields) || targetFields.length === 0) {
      console.warn('[LevenshteinService] Invalid sourceField or targetFields:', sourceField, targetFields);
      return {
        sourceField: sourceField || '',
        suggestedField: '',
        confidence: 0,
        distance: 0
      };
    }
    // Filter out undefined/null/empty target fields
    const validTargets = targetFields.filter(f => typeof f === 'string' && f.trim().length > 0);
    if (validTargets.length === 0) {
      console.warn('[LevenshteinService] No valid target fields:', targetFields);
      return {
        sourceField,
        suggestedField: '',
        confidence: 0,
        distance: 0
      };
    }
    let bestMatch = validTargets[0];
    let bestDistance = this.calculateDistance(sourceField.toLowerCase(), validTargets[0].toLowerCase());
    let bestConfidence = this.calculateConfidence(sourceField, validTargets[0], bestDistance);
    for (let i = 1; i < validTargets.length; i++) {
      const distance = this.calculateDistance(sourceField.toLowerCase(), validTargets[i].toLowerCase());
      const confidence = this.calculateConfidence(sourceField, validTargets[i], distance);
      if (confidence > bestConfidence) {
        bestMatch = validTargets[i];
        bestDistance = distance;
        bestConfidence = confidence;
      }
    }
    return {
      sourceField,
      suggestedField: bestMatch,
      confidence: bestConfidence,
      distance: bestDistance
    };
  }

  /**
   * Get all matches sorted by confidence
   */
  getAllMatches(sourceField: string, targetFields: string[]): FieldMatch[] {
    if (!sourceField || !Array.isArray(targetFields) || targetFields.length === 0) {
      console.warn('[LevenshteinService] Invalid sourceField or targetFields:', sourceField, targetFields);
      return [];
    }
    // Filter out undefined/null/empty target fields
    const validTargets = targetFields.filter(f => typeof f === 'string' && f.trim().length > 0);
    if (validTargets.length === 0) {
      console.warn('[LevenshteinService] No valid target fields:', targetFields);
      return [];
    }
    const matches = validTargets.map(targetField => {
      const distance = this.calculateDistance(sourceField.toLowerCase(), targetField.toLowerCase());
      const confidence = this.calculateConfidence(sourceField, targetField, distance);
      return {
        sourceField,
        suggestedField: targetField,
        confidence,
        distance
      };
    });
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate confidence score (0-1) based on distance and field similarity
   */
  private calculateConfidence(sourceField: string, targetField: string, distance: number): number {
    const maxLength = Math.max(sourceField.length, targetField.length);
    const normalizedDistance = distance / maxLength;
    
    // Base confidence from distance
    let confidence = 1 - normalizedDistance;
    
    // Bonus for exact matches (case insensitive)
    if (sourceField.toLowerCase() === targetField.toLowerCase()) {
      confidence = 1.0;
    }
    
    // Bonus for partial matches
    else if (sourceField.toLowerCase().includes(targetField.toLowerCase()) || 
             targetField.toLowerCase().includes(sourceField.toLowerCase())) {
      confidence += 0.2;
    }
    
    // Bonus for common field name patterns
    const commonPatterns = [
      { source: 'email', target: 'email' },
      { source: 'name', target: 'name' },
      { source: 'phone', target: 'phone' },
      { source: 'address', target: 'address' },
      { source: 'company', target: 'company' },
      { source: 'title', target: 'title' },
      { source: 'bio', target: 'biography' },
      { source: 'first', target: 'firstName' },
      { source: 'last', target: 'lastName' }
    ];

    for (const pattern of commonPatterns) {
      if (sourceField.toLowerCase().includes(pattern.source) && 
          targetField.toLowerCase().includes(pattern.target)) {
        confidence += 0.3;
        break;
      }
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Get system fields for a specific record type
   */
  getSystemFields(recordType: string): string[] {
    const fieldMappings: { [key: string]: string[] } = {
      'Speakers': [
        'firstName',
        'lastName', 
        'email',
        'phone',
        'company',
        'title',
        'biography',
        'expertise',
        'linkedin',
        'twitter',
        'website',
        'location',
        'bio',
        'name',
        'contact'
      ],
      'Events': [
        'name',
        'description',
        'startDate',
        'endDate',
        'location',
        'venue',
        'capacity',
        'organizer',
        'type',
        'status',
        'title',
        'date',
        'address'
      ],
      'Sessions': [
        'title',
        'description',
        'startTime',
        'endTime',
        'speaker',
        'room',
        'track',
        'type',
        'duration',
        'name',
        'time',
        'location'
      ]
    };

    return fieldMappings[recordType] || [];
  }
} 