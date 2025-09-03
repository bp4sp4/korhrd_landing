"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./admin.module.css";

interface ContactInquiry {
  id: number;
  desired_course: string;
  education: string;
  name: string;
  contact: string;
  special_notes: string;
  created_at: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setIsLoggedIn(true);
      fetchInquiries();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setIsLoggedIn(true);
        fetchInquiries();
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      console.log("Fetching inquiries...");

      const { data, error } = await supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      setInquiries(data || []);
      setCurrentPage(1); // 데이터 새로 로드 시 첫 페이지로
      console.log("Inquiries loaded successfully:", data?.length || 0);
    } catch (error) {
      console.error("Error fetching inquiries:", error);

      // 더 구체적인 오류 메시지 제공
      let errorMessage = "데이터를 불러오는 중 오류가 발생했습니다.";

      if (error && typeof error === "object" && "message" in error) {
        errorMessage = `오류: ${error.message}`;
      } else if (error && typeof error === "string") {
        errorMessage = `오류: ${error}`;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(inquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInquiries = inquiries.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setIsLoggedIn(false);
      setInquiries([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loginForm}>
          <h1>어드민 로그인</h1>

          <div className={styles.inputGroup}>
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              disabled={authLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={authLoading}
            />
          </div>
          <button
            onClick={handleLogin}
            className={styles.loginButton}
            disabled={authLoading}
          >
            {authLoading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h1>상담 신청 내역</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          로그아웃
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>총 신청 건수</h3>
          <p>{inquiries.length}건</p>
        </div>
        <div className={styles.statCard}>
          <h3>오늘 신청 건수</h3>
          <p>
            {
              inquiries.filter(
                (inquiry) =>
                  new Date(inquiry.created_at).toDateString() ===
                  new Date().toDateString()
              ).length
            }
            건
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <div className={styles.tableContainer}>
          {inquiries.length === 0 ? (
            <p className={styles.noData}>상담 신청 내역이 없습니다.</p>
          ) : (
            <table className={styles.inquiriesTable}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>신청일시</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>희망과정</th>
                  <th>최종학력</th>
                  <th>특이사항</th>
                </tr>
              </thead>
              <tbody>
                {currentInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>{inquiry.id}</td>
                    <td>
                      {new Date(inquiry.created_at).toLocaleString("ko-KR")}
                    </td>
                    <td>{inquiry.name}</td>
                    <td>{inquiry.contact}</td>
                    <td>{inquiry.desired_course}</td>
                    <td>{inquiry.education}</td>
                    <td>{inquiry.special_notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
