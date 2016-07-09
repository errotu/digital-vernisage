/*jslint browser: true*/
/*global  $*/

/*jslint browser: true*/
/*global  $*/


document.addEventListener("deviceready", function () {
    $.ajaxSetup({ cache: false });
    console.log("test");
    $.getJSON('https://media.weedoocare-cloud.com/DigitalVernisage/blog.php?callback=?', function (blog) {
        var output = "",
            i,
            current,
            prefix = "";
        for (i = 0; i < blog.blogentries.length; i = i + 1) {
          current = blog.blogentries[i];
          if(!current.source.startsWith("http")) {
            prefix = "https://media.weedoocare-cloud.com/DigitalVernisage/";
          }
            if (blog.blogentries[i].type === "img") {
                output += "<figure itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">" +
                              "<a href=\""+ prefix + current.source +"\" itemprop=\"contentUrl\" data-size=\"800x450\">" +
                                  "<img src=\""+ prefix + current.thumb +"\" itemprop=\"thumbnail\" alt=\""+ current.title +"\" />" +
                              "</a>" +
                              "<figcaption itemprop=\"caption description\">"+current.title+"</figcaption>" +
                            "</figure>";
            } else if (blog.blogentries[i].type === "video") {
                output += "<figure itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">" +
                              "<a href=\""+ prefix + current.source +"\" itemprop=\"contentUrl\" data-size=\"800x450\">" +
                                  "<img src=\""+ prefix + current.thumb +"\" itemprop=\"thumbnail\" alt=\""+current.title+"\" />" +
                              "</a>" +
                              "<figcaption itemprop=\"caption description\">"+current.title+"</figcaption>" +
                            "</figure>";
            }
        }
        $("#gallery").html(output);
        $.ajaxSetup({ cache: true });
    });
});
