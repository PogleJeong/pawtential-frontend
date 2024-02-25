/**
 * 파일 업로드에 사용되는 파일용량 제한.
 * 프론트단에서 먼저 검증하고, 백엔드에서 최종적으로 받아야함.
 * @param {*} file 
 * @param {*} max_size kb 단위
 */
export const CheckImageFileSize = (file, max_size) => {
    console.log(file, max_size);
    let { size } = file;
    console.log(size);
    if (size > max_size) {
        alert(`업로드할 이미지 용량은 최대 ${max_size/1024}MB 입니다.`);
        return false;
    }
    return true;
}