import { setAppLoadedProgress, showLoaderInMapPage } from "../redux/utilsSlice";
  import { useNavigation } from 'expo-router';
  import { ScreenName, StackNavigation } from '@/types/App';
  import { useAppDispatch, useAppSelector } from './useRedux';
import { showSnackbarInMapPage } from "@/redux/snackbarSlice";
  
  const useUtils = () => {
    const navigate = useNavigation<StackNavigation>();
    const dispatch = useAppDispatch();
    const progress = useAppSelector((state) => state.utils.progress);
    
    const snackbarConfig = useAppSelector((state) => state.snackbar.snackbarConfig);
    const loader = useAppSelector((state) => state.utils.loader);

    function showSnackbar(text: string | undefined, duration = 4, actionLabel?: string) {
      dispatch(
        showSnackbarInMapPage({
          message: text,
          duration: duration * 1000,
          actionLabel: actionLabel,
        }),
      );
    }

    function showLoader(value: boolean) {
      dispatch(showLoaderInMapPage(value));
    }
  
    const navigateTo = async (page: ScreenName, options?: any) => {
      navigate.navigate(page, options);
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    };
    const setAppProgress = (progress: number) => {
      dispatch(setAppLoadedProgress(progress));
    };
    
    return {
      snackbarConfig,
      loader,
      progress,
      showSnackbar,
      showLoader,
      navigateTo,
      setAppProgress,
    };
  };
  export default useUtils;
  