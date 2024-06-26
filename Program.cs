var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//jack - begin (put this after AddControllers)
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CorsPolicy",
        builder => builder
            .WithOrigins("http://localhost:5049")  //This must be the port of the webapp is running on (not the port this webapi is running on)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
    );
});
//jack - end


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

//jack - begin (put this after UseHttpsRedirection
app.UseCors("CorsPolicy");
//jack - end

app.UseAuthorization();

app.MapControllers();

app.Run();
