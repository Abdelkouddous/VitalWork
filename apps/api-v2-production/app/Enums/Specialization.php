<?php

namespace App\Enums;

/**
 * Specialization — Medical specialization taxonomy.
 *
 * This is the core domain vocabulary for VitalWork. Every job posting
 * and candidate profile references this enum. Extending it requires
 * a new enum case — not a database row or a magic string.
 */
enum Specialization: string
{
    case GENERAL_PRACTITIONER = 'general_practitioner';
    case CARDIOLOGIST = 'cardiologist';
    case DERMATOLOGIST = 'dermatologist';
    case GASTROENTEROLOGIST = 'gastroenterologist';
    case NEUROLOGIST = 'neurologist';
    case ONCOLOGIST = 'oncologist';
    case PSYCHIATRIST = 'psychiatrist';
    case RHEUMATOLOGIST = 'rheumatologist';
    case UROLOGIST = 'urologist';
    case ENDOCRINOLOGIST = 'endocrinologist';
    case OPHTHALMOLOGIST = 'ophthalmologist';
    case ORTHOPEDIC_SPECIALIST = 'orthopedic_specialist';
    case PEDIATRICIAN = 'pediatrician';
    case PULMONOLOGIST = 'pulmonologist';
    case SURGERY_SPECIALIST = 'surgery_specialist';
    case VASCULAR_SPECIALIST = 'vascular_specialist';
    case DENTIST = 'dentist';
    case PHARMACIST = 'pharmacist';
    case PATHOLOGIST = 'pathologist';
    case NURSE = 'nurse';
    case PHYSIOTHERAPIST = 'physiotherapist';
    case RADIOLOGIST = 'radiologist';
    case ANESTHESIOLOGIST = 'anesthesiologist';
    case EMERGENCY_MEDICINE = 'emergency_medicine';

    public function label(): string
    {
        return match ($this) {
            self::GENERAL_PRACTITIONER => 'General Practitioner',
            self::CARDIOLOGIST => 'Cardiologist',
            self::DERMATOLOGIST => 'Dermatologist',
            self::GASTROENTEROLOGIST => 'Gastroenterologist',
            self::NEUROLOGIST => 'Neurologist',
            self::ONCOLOGIST => 'Oncologist',
            self::PSYCHIATRIST => 'Psychiatrist',
            self::RHEUMATOLOGIST => 'Rheumatologist',
            self::UROLOGIST => 'Urologist',
            self::ENDOCRINOLOGIST => 'Endocrinologist',
            self::OPHTHALMOLOGIST => 'Ophthalmologist',
            self::ORTHOPEDIC_SPECIALIST => 'Orthopedic Specialist',
            self::PEDIATRICIAN => 'Pediatrician',
            self::PULMONOLOGIST => 'Pulmonologist',
            self::SURGERY_SPECIALIST => 'Surgery Specialist',
            self::VASCULAR_SPECIALIST => 'Vascular Specialist',
            self::DENTIST => 'Dentist',
            self::PHARMACIST => 'Pharmacist',
            self::PATHOLOGIST => 'Pathologist',
            self::NURSE => 'Nurse',
            self::PHYSIOTHERAPIST => 'Physiotherapist',
            self::RADIOLOGIST => 'Radiologist',
            self::ANESTHESIOLOGIST => 'Anesthesiologist',
            self::EMERGENCY_MEDICINE => 'Emergency Medicine',
        };
    }
}
