/**
 * asset
 * public 폴더 절대경로 앞에 Vite BASE_URL을 붙여준다.
 * GitHub Pages 프로젝트 사이트(/repo-name/ 하위 경로) 배포 대응.
 *
 * @param {string} path - '/img/...' 형태의 public 절대경로 [Required]
 *
 * Example usage:
 * asset('/img/콘텐츠1/전통한복/logo02.png')
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
