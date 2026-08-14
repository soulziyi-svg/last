import { useEffect, useState } from 'react';

/**
 * useHeaderScrolled
 * 스크롤이 threshold(px)를 넘으면 true를 반환한다. 헤더 축소 애니메이션에 사용.
 *
 * @param {number} threshold - [Optional, 기본값: 40]
 *
 * Example usage:
 * const isScrolled = useHeaderScrolled();
 */
function useHeaderScrolled(threshold = 40) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}

export default useHeaderScrolled;
