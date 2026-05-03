"use client";

import React from 'react';
import { useLocale } from './LocaleProvider';

export default function LocalizedHeading({ k, children, className = '', as: Tag = 'h2' }) {
  const { t } = useLocale();
  return <Tag className={className}>{t(k) || children}</Tag>;
}
