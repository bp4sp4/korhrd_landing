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
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    // 페이지 로드 시 로그인 상태 확인
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        await fetchInquiries();
      } else {
        // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
    } finally {
      setInitialLoading(false);
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

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 이 상담 신청을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // 삭제 후 목록 새로고침
      await fetchInquiries();
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("Delete error:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentInquiries.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentInquiries.map((inquiry) => inquiry.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedItems.length}개의 상담 신청을 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .delete()
        .in("id", selectedItems);

      if (error) throw error;

      // 삭제 후 목록 새로고침 및 선택 초기화
      await fetchInquiries();
      setSelectedItems([]);
      alert(`${selectedItems.length}개의 항목이 삭제되었습니다.`);
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 초기 로딩 중일 때 로딩 화면 표시
  if (initialLoading) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loading}>인증 상태를 확인하는 중...</div>
      </div>
    );
  }

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
        {selectedItems.length > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.selectedCount}>
              {selectedItems.length}개 선택됨
            </span>
            <button
              onClick={handleBulkDelete}
              className={styles.bulkDeleteButton}
            >
              선택 삭제
            </button>
          </div>
        )}
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
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === currentInquiries.length &&
                        currentInquiries.length > 0
                      }
                      onChange={handleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>
                  <th>번호</th>
                  <th>신청일시</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>희망과정</th>
                  <th>최종학력</th>
                  <th>특이사항</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {currentInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(inquiry.id)}
                        onChange={() => handleSelectItem(inquiry.id)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td>{inquiry.id}</td>
                    <td>
                      {new Date(inquiry.created_at).toLocaleString("ko-KR")}
                    </td>
                    <td>{inquiry.name}</td>
                    <td>{inquiry.contact}</td>
                    <td>{inquiry.desired_course}</td>
                    <td>{inquiry.education}</td>
                    <td>{inquiry.special_notes || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className={styles.deleteButton}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 페이지네이션 */}
      {inquiries.length > itemsPerPage && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.activePage : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
