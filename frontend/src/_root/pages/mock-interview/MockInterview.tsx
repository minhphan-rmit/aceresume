import AppNavBar from '../../components/NavBar/AppAppBar';
import FeatureBar from '../../components/FeatureBar/FeatureBar';
import getLPTheme from "../../../styles/getLPTheme";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import InterviewChat from './components/InterviewChat';
const MockInterview = () => {
    const LPtheme = createTheme(getLPTheme());

    return (
        <ThemeProvider theme={LPtheme}>
            <AppNavBar />
            <div><FeatureBar/></div>
      <div className="flex items-start justify-center w-screen h-screen p-10 space-x-6 bg-gray-100">
      <div className="w-full bg-white h-full rounded-lg  flex flex-col items-center p-10">
            <InterviewChat/>
</div>

</div>
        </ThemeProvider>
    )


}
export default MockInterview;
