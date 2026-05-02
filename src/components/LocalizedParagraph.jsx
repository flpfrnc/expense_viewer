"use client";

import React from 'react';
import { useLocale } from './LocaleProvider';

export default function LocalizedParagraph({ k, className = '', children }) {
  const { t } = useLocale();
  return <p className={className}>{t(k) || children}</p>;
}
