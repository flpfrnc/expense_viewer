"use client";

import React from 'react';
import { useLocale } from './LocaleProvider';

export default function LocalizedHeading({ k, children, className = '' }) {
  const { t } = useLocale();
  return <h2 className={className}>{t(k) || children}</h2>;
}
