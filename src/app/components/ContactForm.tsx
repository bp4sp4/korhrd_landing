"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    desiredCourse: "",
    education: "",
    name: "",
    contact: "",
    specialNotes: "",
  });
  const [otherCourse, setOtherCourse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [privacyAgreement, setPrivacyAgreement] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // 연락처 필드인 경우 하이푼 자동 포맷팅
    if (name === "contact") {
      const formattedValue = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // 기타 과정 선택 시 기타 입력창 초기화
    if (name === "desiredCourse" && value !== "기타") {
      setOtherCourse("");
    }
  };

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7
      )}`;
    } else {
      // 11자리 초과 시 11자리까지만
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 유효성 검사
    if (!formData.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!formData.contact.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }

    if (!formData.desiredCourse) {
      alert("희망과정을 선택해주세요.");
      return;
    }

    if (formData.desiredCourse === "기타" && !otherCourse.trim()) {
      alert("기타 과정을 선택하셨습니다. 과정명을 입력해주세요.");
      return;
    }

    if (!privacyAgreement) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const { error } = await supabase.from("contact_inquiries").insert([
        {
          desired_course:
            formData.desiredCourse === "기타"
              ? otherCourse
              : formData.desiredCourse,
          education: formData.education,
          name: formData.name,
          contact: formData.contact,
          special_notes: formData.specialNotes,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitStatus("success");
      setFormData({
        desiredCourse: "",
        education: "",
        name: "",
        contact: "",
        specialNotes: "",
      });
      setOtherCourse("");
      setPrivacyAgreement(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <h2 className={styles.contactTitle}>상담 신청</h2>
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="desiredCourse" className={styles.label}>
              희망과정 *(상담 후 결정 희망하시면 기타 선택해주세요!)
            </label>
            <select
              id="desiredCourse"
              name="desiredCourse"
              value={formData.desiredCourse}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">과정을 선택해주세요</option>
              <option value="사회복지사 2급">사회복지사 2급</option>
              <option value="보육교사 2급">보육교사 2급</option>
              <option value="장애영유아 보육교사">장애영유아 보육교사</option>
              <option value="아동학사">아동학사</option>
              <option value="정사서 2급">정사서 2급</option>
              <option value="기타">기타</option>
            </select>

            {/* 기타 과정 입력창 */}
            {formData.desiredCourse === "기타" && (
              <div className={styles.formGroup}>
                <label htmlFor="otherCourse" className={styles.label}>
                  기타 과정명 *
                </label>
                <input
                  type="text"
                  id="otherCourse"
                  name="otherCourse"
                  value={otherCourse}
                  onChange={(e) => setOtherCourse(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="희망하시는 과정명을 입력해주세요"
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="education" className={styles.label}>
              최종학력 *(최종학력마다 과정이 조금씩 달라져요!)
            </label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">학력을 선택해주세요</option>
              <option value="고등학교 졸업">고등학교 졸업</option>
              <option value="대학교 졸업">대학교 졸업</option>
              <option value="대학교 중퇴">대학교 중퇴</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              이름 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="이름을 입력해주세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contact" className={styles.label}>
              연락처 *
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="연락처를 입력해주세요"
              maxLength={13}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="specialNotes" className={styles.label}>
              특이사항
            </label>
            <textarea
              id="specialNotes"
              name="specialNotes"
              value={formData.specialNotes}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="추가로 문의하고 싶은 내용이 있으시면 입력해주세요"
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.privacyAgreement}>
              <input
                type="checkbox"
                id="privacyAgreement"
                checked={privacyAgreement}
                onChange={(e) => setPrivacyAgreement(e.target.checked)}
                className={styles.checkbox}
                required
              />
              <label
                htmlFor="privacyAgreement"
                className={styles.checkboxLabel}
              >
                <span className={styles.required}>*</span>{" "}
                <span className={styles.privacyText}>
                  개인정보 수집 및 이용에 동의합니다.
                </span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className={styles.privacyLink}
                >
                  (자세히 보기)
                </button>
              </label>
            </div>
            <div className={styles.privacyDetails}>
              <p>수집항목: 이름, 연락처, 희망과정, 최종학력, 특이사항</p>
              <p>수집목적: 교육 상담 서비스 제공</p>
              <p>보유기간: 상담 완료 후 1년</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !privacyAgreement}
            className={styles.submitButton}
          >
            {isSubmitting ? "제출 중..." : "상담 신청하기"}
          </button>

          {submitStatus === "success" && (
            <div className={styles.successMessage}>
              상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.
            </div>
          )}

          {submitStatus === "error" && (
            <div className={styles.errorMessage}>
              상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.
            </div>
          )}
        </form>
      </div>

      {/* 개인정보 수집 및 이용동의 모달 */}
      {showPrivacyModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowPrivacyModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>개인정보 수집 및 이용동의</h3>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowPrivacyModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                수집하는 개인정보의 항목은 빠른 학습상담 신청을 위해 아래와 같은
                개인정보를 수집하고 있습니다.
              </p>

              <h4>수집항목</h4>
              <p>이름, 연락처, 상담내용</p>

              <h4>개인정보 수집방법</h4>
              <p>홈페이지 (문의하기)</p>

              <h4>개인정보의 수집 및 이용목적</h4>
              <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
              <ul>
                <li>
                  <strong>회원 관리</strong> : 회원제 서비스 이용에 따른
                  본인확인, 개인 식별, 가입 의사 확인, 불만처리 등 민원처리,
                  고지사항 전달
                </li>
                <li>
                  <strong>마케팅 및 광고에 활용</strong> : 신규 서비스(제품)
                  개발 및 특화, 이벤트 등 광고성 정보 전달
                </li>
              </ul>

              <h4>개인정보의 보유 및 이용기간</h4>
              <p>2년</p>
              <p>
                회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당
                정보를 지체 없이 파기합니다.
              </p>

              <h4>동의 거부권</h4>
              <p>귀하께서는 개인정보 제공 및 활용에 거부할 권리가 있습니다.</p>

              <h4>거부에 따른 불이익</h4>
              <p>
                위 제공사항은 상담에 반드시 필요한 사항으로 거부하실 경우 상담이
                불가능함을 알려드립니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
