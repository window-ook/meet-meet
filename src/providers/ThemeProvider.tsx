"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeProviderProps {
    children: React.ReactNode;
}

interface ThemeContextType {
    toggleDarkMode: (newTheme: "light" | "dark" | "system") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme은 ThemeProvider 내부에서 사용해야 합니다.");
    }

    return context;
}

// 모든 transition을 일시적으로 비활성화
const disableTransitions = () => {
    const css = document.createElement('style');
    css.type = 'text/css';
    css.appendChild(document.createTextNode(
        `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
        }`
    ));
    document.head.appendChild(css);
    
    return css;
};

// transition을 다시 활성화하는 함수
const enableTransitions = (styleElement: HTMLStyleElement) => {
    // 다음 frame에서 실행하여 DOM 업데이트가 완료된 후 transition 복원
    requestAnimationFrame(() => {
        document.head.removeChild(styleElement);
    });
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    // 1. 테마 상태 관리
    const [isDark, setIsDark] = useState<boolean>(() => {
        // 2. 로컬스토리지에 theme 값이 존재한다면 그걸 초기값으로 한다.
        if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
            return localStorage.getItem("theme") === "dark";
        }

        // 3. 현재 OS 시스템이 다크모드라면
        if (
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            return true;
        }

        // 4. 모든 경우가 아니라면 라이트 모드를 기본값으로 한다.
        return false;
    });

    const toggleDarkMode = (newTheme: "light" | "dark" | "system") => {
        // 테마 변경 전에 모든 transition 비활성화
        const disableStyleElement = disableTransitions();

        // 시스템 모드 선택 시
        if (newTheme === "system") {
            // 시스템 모드 선택 시 로컬스토리지에서 theme 값 제거
            localStorage.removeItem("theme");
            // 시스템 모드 선택 시 현재 OS 시스템의 모드를 따른다.
            setIsDark(
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? true
                    : false,
            );
        } else {
            // 라이트 또는 다크 모드 선택 시
            localStorage.setItem("theme", newTheme);
            setIsDark(newTheme === "dark");
        }

        // 테마 변경 후 transition 다시 활성화
        enableTransitions(disableStyleElement);
    };

    // theme 변경 시 루트 태그(html)에 dark 클래스 추가
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    // OS 시스템 변경 시 감지
    useEffect(() => {
        // 브라우저의 MediaQuery API를 사용하여 사용자의 시스템이 다크모드를 사용하고 있는지 확인하는 코드
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            if (!("theme" in localStorage)) {
                // 시스템 모드 변경 시에도 transition 비활성화
                const disableStyleElement = disableTransitions();
                
                // 다크 모드 사용 시 e.matches 값이 true, 라이트 모드 사용 시 false
                setIsDark(e.matches);
                
                // transition 다시 활성화
                enableTransitions(disableStyleElement);
            }
        };

        // 미디어 쿼리 변경 시 이벤트 리스너 추가
        mediaQuery.addEventListener("change", handleChange);

        // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ toggleDarkMode }}>
            <div>{children}</div>
        </ThemeContext.Provider>
    );
}