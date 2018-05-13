export const bgColor = "#e6e4e2";

export const boardBgColor = "#BBADA0";
export const underBoxColor = "#D6CDC4";
export const lightTextCl = "#F9F6F3";
export const darkTextCl = "#786F66";

export const mainCl = "#FAAF3B";
export const subCl = "#d6d4d3";

export const mainClDarken = shadeColor(mainCl, 15);
export const subClDarken = shadeColor(subCl, 15);


export const red = "#FE4A49";
export const green = "#00A676";

export const colorShemes = {
    orange : {
        2: "#EEE4DA",
        4: "#ECE0C8",
        8: "#F3B079",
        16: "#F59563",
        32: "#F67C5F",
        64: "#F55F38",
        128: "#EFCC78",
        256: "#EDCC61",
        512: "#EDC850",
        1024: "#EDC440",
        2048: "#EDC12E",
        4096: "#FF3D3C",
        8192: "#FF1E1E"
    }
}

function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}