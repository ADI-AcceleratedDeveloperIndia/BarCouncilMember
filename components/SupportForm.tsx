"use client";

import { useState } from "react";
import { Language } from "@/types";
import { getContent } from "@/lib/content";

interface SupportFormProps {
  language: Language;
  onSubmit: (data: {
    name: string;
    enrollmentNumber: string;
    district: string;
    barAssociation: string;
    customMessage: string;
  }) => void;
  onCancel: () => void;
}

export default function SupportForm({
  language,
  onSubmit,
  onCancel,
}: SupportFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    district: "",
    barAssociation: "",
    customMessage: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const content = getContent(language);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = content.support.form.required;
    }
    if (!formData.enrollmentNumber.trim()) {
      newErrors.enrollmentNumber = content.support.form.required;
    }
    if (!formData.district.trim()) {
      newErrors.district = content.support.form.required;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
        {content.support.form.title}
      </h2>

      <div>
        <label className="block text-white mb-2">
          {content.support.form.name} <span className="text-gold">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-4 py-2 bg-black border-2 border-gold text-white rounded focus:outline-none focus:border-gold"
          required
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-white mb-2">
          {content.support.form.enrollment}{" "}
          <span className="text-gold">*</span>
        </label>
        <input
          type="text"
          value={formData.enrollmentNumber}
          onChange={(e) =>
            setFormData({ ...formData, enrollmentNumber: e.target.value })
          }
          className="w-full px-4 py-2 bg-black border-2 border-gold text-white rounded focus:outline-none focus:border-gold"
          required
        />
        {errors.enrollmentNumber && (
          <p className="text-red-400 text-sm mt-1">
            {errors.enrollmentNumber}
          </p>
        )}
      </div>

      <div>
        <label className="block text-white mb-2">
          {content.support.form.district} <span className="text-gold">*</span>
        </label>
        <input
          type="text"
          value={formData.district}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
          className="w-full px-4 py-2 bg-black border-2 border-gold text-white rounded focus:outline-none focus:border-gold"
          required
        />
        {errors.district && (
          <p className="text-red-400 text-sm mt-1">{errors.district}</p>
        )}
      </div>

      <div>
        <label className="block text-white mb-2">
          {content.support.form.barAssociation}
        </label>
        <input
          type="text"
          value={formData.barAssociation}
          onChange={(e) =>
            setFormData({ ...formData, barAssociation: e.target.value })
          }
          className="w-full px-4 py-2 bg-black border-2 border-gold text-white rounded focus:outline-none focus:border-gold"
        />
      </div>

      <div>
        <label className="block text-white mb-2">
          {language === "en"
            ? "Your Message (Optional)"
            : "మీ సందేశం (ఐచ్ఛికం)"}
        </label>
        <textarea
          value={formData.customMessage}
          onChange={(e) =>
            setFormData({ ...formData, customMessage: e.target.value })
          }
          placeholder={
            language === "en"
              ? "Write your support message here (max 100 characters)..."
              : "మీ మద్దతు సందేశాన్ని ఇక్కడ వ్రాయండి (గరిష్టంగా 100 అక్షరాలు)..."
          }
          className="w-full px-4 py-2 bg-black border-2 border-gold text-white rounded focus:outline-none focus:border-gold min-h-[100px] resize-y"
          maxLength={100}
        />
        <p className="text-white/60 text-sm mt-1">
          {language === "en"
            ? "This message will appear on your support card (max 100 characters)"
            : "ఈ సందేశం మీ మద్దతు కార్డ్‌లో కనిపిస్తుంది (గరిష్టంగా 100 అక్షరాలు)"}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-gold/90 transition"
        >
          {content.support.form.submit}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border-2 border-gold text-white px-6 py-3 rounded font-semibold hover:bg-gold/10 transition"
        >
          {language === "en" ? "Back" : "వెనక్కి"}
        </button>
      </div>
    </form>
  );
}

