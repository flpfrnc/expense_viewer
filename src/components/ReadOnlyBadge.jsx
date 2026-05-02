"use client";

import React from 'react';
import { useLocale } from './LocaleProvider';

export default function ReadOnlyBadge() {
  const { t } = useLocale();
  return (
    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm">
      {t('readOnly')}
    </span>
  );
}
