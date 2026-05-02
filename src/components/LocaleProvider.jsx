"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const LocaleContext = createContext(null);

const translations = {
  en: {
    appTitle: 'Expense Viewer',
    shareDashboard: 'Share Dashboard',
    linkCopied: 'Link Copied!',
    addNewExpense: 'Add New Expense',
    oneTime: 'One-Time',
    installment: 'Installment',
    expenseName: 'Expense Name',
    amount: 'Amount (R$)',
    totalAmount: 'Total Amount (R$)',
    installments: 'Number of Installments',
    status: 'Status',
    pending: 'pending',
    paid: 'paid',
    saveExpense: 'Save Expense',
    selectDashboard: 'Select Dashboard:',
    create: 'Create',
    cancel: 'Cancel',
    createNew: '+ Create New',
    readOnly: 'Read Only',
    deleteConfirm: 'Delete "{name}"? This action cannot be undone.',
    markNextInstallment: 'Mark next installment as paid',
    markPreviousInstallment: 'Decrease installment',
    sharedMonthForecast: 'Shared Month Forecast',
    installmentExpenses: 'Installment Expenses',
    oneTimeExpenses: 'One-Time Expenses',
    monthlyHistory: 'Monthly History',
    amountPerPart: 'Amount per part:',
    totalLabel: 'Total:',
    installmentsProgress: '{paid}/{total} installments',
    deleteInstallment: 'Delete installment',
    deleteExpense: 'Delete expense',
    markAsPending: 'Mark as pending',
    markAsPaid: 'Mark as paid',
    installmentDetail: 'Installment',
    noInstallmentExpensesYet: 'No installment expenses yet.',
    noOneTimeExpensesYet: 'No one-time expenses yet.',
    noHistoryYet: 'No history available yet.',
  },
  pt: {
    appTitle: 'Visualizador de Gastos',
    shareDashboard: 'Compartilhar Painel',
    linkCopied: 'Link copiado!',
    addNewExpense: 'Adicionar Despesa',
    oneTime: 'À vista',
    installment: 'Parcelado',
    expenseName: 'Nome da Despesa',
    amount: 'Valor (R$)',
    totalAmount: 'Valor Total (R$)',
    installments: 'Número de Parcelas',
    status: 'Status',
    pending: 'pendente',
    paid: 'pago',
    saveExpense: 'Salvar Despesa',
    selectDashboard: 'Selecionar Painel:',
    create: 'Criar',
    cancel: 'Cancelar',
    createNew: '+ Criar Novo',
    readOnly: 'Somente Leitura',
    deleteConfirm: 'Deletar "{name}"? Esta ação não pode ser desfeita.',
    markNextInstallment: 'Marcar próxima parcela como paga',
    markPreviousInstallment: 'Diminuir parcela',
    sharedMonthForecast: 'Previsão do Mês (Compartilhado)',
    installmentExpenses: 'Despesas Parceladas',
    oneTimeExpenses: 'Despesas Únicas',
    monthlyHistory: 'Histórico Mensal',
    amountPerPart: 'Valor por parcela:',
    totalLabel: 'Total:',
    installmentsProgress: '{paid}/{total} parcelas',
    deleteInstallment: 'Deletar parcela',
    deleteExpense: 'Deletar despesa',
    markAsPending: 'Marcar como pendente',
    markAsPaid: 'Marcar como paga',
    installmentDetail: 'Parcela',
    noInstallmentExpensesYet: 'Ainda não há despesas parceladas.',
    noOneTimeExpensesYet: 'Ainda não há despesas únicas.',
    noHistoryYet: 'Ainda não há histórico disponível.',
  }
};

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState('pt');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lv_lang');
      if (stored) setLang(stored);
    } catch (e) {}
  }, []);

  const toggle = () => {
    const next = lang === 'en' ? 'pt' : 'en';
    setLang(next);
    try { localStorage.setItem('lv_lang', next); } catch (e) {}
  };

  const t = (key, vars = {}) => {
    const str = (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
    return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  };

  return (
    <LocaleContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) return { lang: 'pt', toggle: () => {}, t: (k) => k };
  return ctx;
}
