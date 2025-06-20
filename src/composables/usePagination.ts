import { ref, computed, type Ref } from 'vue';

/**
 * 分页管理 composable
 * 处理分页逻辑，自动计算当前页数据
 */
export function usePagination<T>(sourceData: Ref<T[]>, initialPageSize = 10) {
  // 状态
  const currentPage = ref(1);
  const pageSize = ref(initialPageSize);

  // 计算属性
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sourceData.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(sourceData.value.length / pageSize.value);
  });

  // 方法
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const changePageSize = (size: number) => {
    pageSize.value = size;
    // 重新计算当前页，确保不超出范围
    const maxPage = Math.ceil(sourceData.value.length / size);
    if (currentPage.value > maxPage) {
      currentPage.value = Math.max(1, maxPage);
    }
  };

  const resetPagination = () => {
    currentPage.value = 1;
  };

  const goToFirstPage = () => {
    currentPage.value = 1;
  };

  const goToLastPage = () => {
    currentPage.value = totalPages.value;
  };

  const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const goToPrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  return {
    // 状态
    currentPage,
    pageSize,

    // 计算属性
    paginatedData,
    totalPages,

    // 方法
    changePage,
    changePageSize,
    resetPagination,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
  };
}
