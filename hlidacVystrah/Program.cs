using hlidacVystrah.Model;
using hlidacVystrah.Services;
using hlidacVystrah.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true) // Production settings
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true) // Development settings
    .AddEnvironmentVariables();

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
));

builder.Services.AddTransient<IEventsService, EventsService>();
builder.Services.AddTransient<IParseService, ParseService>();
builder.Services.AddTransient<ILocalitiesService, LocalitiesService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IMailService, MailService>();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.Configure<DownloadEventsEndpoint>(builder.Configuration.GetSection("DownloadEventsEndpoint"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
